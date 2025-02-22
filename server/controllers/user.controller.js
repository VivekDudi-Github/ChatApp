import { User } from "../models/user.model.js"
import bycrypt from "bcrypt";
import { generateRefreshTokenSetCookies } from "../utils/generateToken.js";
import { Room } from "../models/room.model.js";
import {Request} from '../models/request.model.js'

const ResError = (res , code , error) => {
  return res.status(code).json({
    success : false ,
    error : error
  })
}
const ResSuccess = (res , code , data) => {
  return res.status(code).json({
    success : true ,
    data : data ,
  })
}

export const UserSignUpController = async( req, res) => {
  try {
    const {email , username , password , name , bio}= req.body
    
    
    if(!name || !bio ||!username || !password || !email ){
      return ResError(res , 400 , 'insufficient credentials')
    }

    const IsValid = [email , username , password , bio , name].every(val => typeof val === 'string')
    if(!IsValid) {
      return ResError(res, 400 , 'data type of feilds is wrong')
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(emailRegex.test(email) === false ){
      return ResError(res, 400 , 'provide a valid email')
    }

    const IsEmailExists = await User.exists({
      email : email 
    })
    if(IsEmailExists){
      return res.status(404).json({
        error : 'email arleardy used'
      })
    }
    
   
    const IsUsernameExists = await User.exists({
      username : username , 
    })
  
    if(IsUsernameExists){
      return res.status(404).json({
        error : 'username arleardy used'
      })
    }
    
   

   
    const saltRounds = await bycrypt.genSalt()
    const HashedPassword = await bycrypt.hash(password , saltRounds )

    const newUser = await User.create({
      email , 
      password : HashedPassword , 
      username ,
      name ,
      bio ,
      avatar : 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg'
    })
    
    const user = await User.findOne({
      _id : newUser._id
    }).select('-password')
  
    return res.status(201).json({
      success : true ,
      user : user
    })

  } catch (error) {
    
    console.log(error , '---error while sinnging up user');
    return ResError(res , 500 ,'Internal server error')
  }
}

export const UserloginController = async( req, res) => {
  try {
    const {email , password} = req.body ;

    if(typeof email !== 'string' || typeof password !== 'string'){
      return ResError(res , 400 , 'please provide data in string format')
    } 

    
    const user =  await User.findOne({email : email})

    if(!user){
      return ResError(res , 404 , "There is no account with this email")
    }
    
    const passCheck = await bycrypt.compare(password , user.password)
    
    if(passCheck !== true){
      return ResError(res , 404  , "password doesn't match")
    }
    
    const refreshToken = await generateRefreshTokenSetCookies(user._id ,res)

    const updatedUser = await User.findByIdAndUpdate(
      {_id : user._id} ,
      {$set : {
        refreshToken : refreshToken
      }}
    ).select('-password -refreshToken')

    return ResSuccess(res , 200 ,updatedUser )

  } catch (error) {
    console.log("---error while loging in" ,error );
    return ResError(res , 500 , 'internal server error')
  }
}

export const UserLogOutController = async(req, res) => {
  try {
    res.clearCookie('refreshToken')

    return ResSuccess(res , 200)
  } catch (error) {
    console.log('error while loggin out user' , error);
    return ResError(res , 500 , 'Internal server error')
  }
}

export const CheckAuth =async (req, res) => {
  if(req.userId){
    const user = await User.findById(req.userId)
    return ResSuccess(res , 200 , user)
  }else{
    return ResError(res ,400 , "Can't find the user")
  }
}

export const UserSearchController = async(req , res) => {
  try {
    const {name = ''} =  req.query ;
    
    const MyChats = await Room.find({ groupChat : false , members : {$in : req.userId}})
    
    const allChatMembers = MyChats.length > 0 ? MyChats.map((c) => c.members).flat() : [] 
    

    const allUnknownUsers = await User.find({
      _id : { $nin : allChatMembers } ,
      name : { $regex : name , $options : 'i'}
    }).select(' name avatar _id')

    

    return ResSuccess(res, 200 , allUnknownUsers)

  } catch (error) {
    console.log('error while search user query' , error);
    return ResError(res, 500 , 'internal server error')
  }
}

export const sendRequest = async(req, res) => {
  try{
    const {id} = req.body ;
    console.log(req);
    
    if(typeof id !== 'string' || !id ){
      return ResError(res , 400 , "Reciever's id not available")
    }

    const arleardyRequest = await Request.exists({
      reciever : id , 
      sender : req.userId ,
      status : 'pending'
    })

    if(arleardyRequest){
      return ResError(res, 400 , 'already sent a request')
    }

    const makeRequest = await Request.findOneAndUpdate({
      reciever : id ,
      sender : req.userId ,
      } , {
      status : 'pending'
      } , {
        new : true ,
        upsert : true ,
      } 
    )
    if(!makeRequest){
      return ResError(res, 500 , makeRequest  )
    }

    return ResSuccess(res, 200 , makeRequest )
  }catch(error){
    console.log('error while SENDING REQUEST' , error);
    return ResError(res, 500 , 'internal server error')
  }
}

export const AnswersRequest = async(req, res) => {
  try {
    const {id , response} = req.body ;
    if(typeof id !== 'string' || !id ){
      return ResError(res , 400 , "Reciever's id not available")
    }
    if(response !== 'rejected' && response !== 'accepted'){
      return ResError(res , 400 , "Response Is incorrect")
    }

    const request =  await Request.findOneAndUpdate({
      reciever : id ,
      sender : req.userId 
    } , 
    {
      status : response 
    } , 
    { new : true}
  )

    return ResSuccess(res , 200 , request)

  } catch (error) {
    console.log('error while ANSWERING REQUEST' , error);
    return ResError(res, 500 , 'internal server error')
  }
}