import { User } from "../models/user.model.js"
import bycrypt from "bcrypt";
import { generateRefreshTokenSetCookies } from "../utils/generateToken.js";

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
    const {email , username , password}= req.body
    
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
    const {email , password} = req.body
    
    const user =  await User.findOne({email : email})

    if(!user){
      return ResError(res , 404 , "There is no account with this email")
    }
    
    const passCheck = await bycrypt.compare(password , user.password)
    console.log(passCheck);
    
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

export const UserLogOutController = async(req , res) => {
  try {
    res.clearCookie('refreshToken')

    return ResSuccess(res , 200)
  } catch (error) {
    console.log('error while loggin out user' , error);
    return ResError(res , 500 , 'Internal server error')
  }
}
export const CheckAuth = (req ,res) => {
  if(req.user){
    return ResSuccess(res , 200 , req.user)
  }else{
    return ResError(res ,400 , "Can't find the user")
  }
}