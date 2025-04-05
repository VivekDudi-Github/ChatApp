import { User } from "../models/user.model.js"
import bycrypt from "bcryptjs";
import { generateRefreshTokenSetCookies } from "../utils/generateToken.js";
import { Room } from "../models/room.model.js";
import {Request} from '../models/request.model.js'
import { emitEvent } from "../utils/features.js";
import { NEW_REQUEST, REFRETCH_CHATS } from "../constants/event.js";
import { uploadFilesTOCloudinary } from "../utils/features.js";

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

const UserSignUpController = async( req, res) => {
  try {
    const {email , username , password , name , bio }= req.body
    const avatar = req?.file
    
    
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
   
    const UsernameRegex = /^[a-zA-Z0-9_@]{3,15}$/ ;
    if(!UsernameRegex.test(username)){
      return res.status(400).json({
        error : 'username contains invalid character'
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

    const result = await uploadFilesTOCloudinary([avatar])

    const newUser = await User.create({
      email , 
      password : HashedPassword , 
      username ,
      name ,
      bio ,
      avatar : {
        public_id : result[0].public_id ,
        url : result[0].url ,
      }
    })
  
    return ResSuccess(res , 200 )

  } catch (error) {
    
    console.log(error , '---error while sinnging up user');
    return ResError(res , 500 ,'Internal server error')
  }
}

const UserloginController = async( req, res) => {
  try {
    const {email , password} = req.body ;
    
    if(!email || !password){
      return ResError(res ,400 ,'required feilds are not found')
    }
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

const UserLogOutController = async(req, res) => {
  try {
    res.clearCookie('refreshToken')

    return ResSuccess(res , 200)
  } catch (error) {
    console.log('error while loggin out user' , error);
    return ResError(res , 500 , 'Internal server error')
  }
}

const CheckAuth = async (req, res) => {
  if(req.userId){
    const user = await User.findById(req.userId).select(' -password -refreshToken')
    return ResSuccess(res , 200 , user)
  }else{
    return ResError(res ,400 , "Can't find the user")
  }
}

const UserSearchController = async(req , res) => {
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

const sendRequest = async(req, res) => {
  try{
    const {id} = req.body ;
    
    
    if(typeof id !== 'string' || !id ){
      return ResError(res , 400 , "Invalid Data Found")
    }

    const arleardyRequest = await Request.exists({
      $or: [
        {reciever : id , sender : req.userId , status : { $in : ['pending' , 'accepted']}} ,
        {sender : id , reciever : req.userId , status : { $in : ['pending' , 'accepted']}} ,
      ] ,
    })

    if(arleardyRequest){
      return ResError(res, 400 , 'You already had a request ')
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
      return ResError(res, 500 , 'An unexpected error occurred'  )
    }

    emitEvent(req , NEW_REQUEST , [id] )

    return ResSuccess(res, 200 , 'Request Sent' )
  }catch(error){
    console.log('error while SENDING REQUEST' , error);
    return ResError(res, 500 , 'internal server error')
  }
}

const AnswersRequest = async(req, res) => {
  try {
    const {id , response} = req.body ;
    if(typeof id !== 'string' || !id ){
      return ResError(res , 400 , "Reciever's id not available")
    }
    if(response !== 'rejected' && response !== 'accepted'){
      return ResError(res , 400 , "Response Is incorrect")
    }

    const request = await Request.findOne({
      sender : id ,
      reciever : req.userId ,
      status : 'pending'
    })

    if(!request){
      return ResError(res ,404 , "No request was found")
    }

    if(response == 'accepted'){
      const newRequest = await Request.findByIdAndUpdate(request._id , 
        {
          status : 'accepted'
        } , 
        {new : true}
      ).populate('sender' , 'name')
      await Room.create({
        groupChat : false , 
        name : newRequest.sender.name ,
        creator : id ,
        members : [id , req.userId] ,
      })
      
      emitEvent(res ,REFRETCH_CHATS , [req.userId._id.toString() , id])
      return ResSuccess(res ,200 ,newRequest)
    }

    if(response == 'rejected'){
      await Request.findByIdAndDelete({_id : request._id})
      
      return ResSuccess(res ,200 , 'Request Refused')
    }
  } catch (error) {
    console.log('error while ANSWERING REQUEST' , error);
    return ResError(res, 500 , 'internal server error')
  }
}

const GetMyFriends = async( req, res) => {
  try {

    const {room} = req.query ;
    
    const AllFriendsRoom =  await Room.find({
      groupChat : false , 
      members : {$in : req.userId} 
    }).populate('members' , 'name avatar')

    if(!AllFriendsRoom){
      return ResError(res , 404 , 'no friends found')
    }

    const friends =  AllFriendsRoom.flatMap((r) => r.members.filter(m => m._id.toString() !== req.userId._id.toString() ) )

    if(room){
      const group = await Room.findById(room) ;

      const availableFriends = friends.filter( f => !group.members.includes(f._id) )
        
      return ResSuccess(res ,200 , availableFriends) 

    }else {
    return ResSuccess(res ,200 , friends)
    }
  } catch (error) {
    console.log('error while GET_MY_FRIENDS' , error)
    return ResError(res, 500 ,'internal server error')
  }
}

const GetMyNotifications = async(req ,res) => {
  try {
    const requests = await Request.find({status : 'pending' , reciever : req.userId}).populate('sender' , 'avatar name')
    
    return ResSuccess(res ,200 , requests)
  } catch (error) {
    console.log('error while SEND_MY_NOTIFICATIONS' , error)
    return ResError(res, 500 ,'internal server error')
  }
}

export {
  GetMyFriends , 
  AnswersRequest , 
  sendRequest , 
  UserLogOutController , 
  UserSearchController , 
  UserSignUpController , 
  UserloginController , 
  GetMyNotifications ,
  CheckAuth ,
 }