import { User } from "../models/user.model.js"
import bycrypt from "bcrypt";
import { generateRefreshTokenSetCookies } from "../utils/generateToken.js";
import { Room } from "../models/room.model.js";

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
    const {name} =  req.query ;
    
    const MyChats = await Room.find({ groupChat : true , members : {$in : req.userId}})
    
    if(MyChats.length === 0 ){
      return ResError(res, 400 ,'no friends found')
    }
    const allmembers = MyChats.map((c) => c.members).flat()
    
    const knowns = allmembers.filter((m) => { return m.toString() !== req.userId._id.toString()}) 

    return ResSuccess(res, 200 , knowns)

  } catch (error) {
    console.log('error while search user query' , error);
    return ResError(res, 500 , 'internal server error')
  }
}