import { Schema , model } from "mongoose";

const userSchema = new Schema({
  email : {
    type : String ,
    unique : true ,
    required : true
  } ,
  username : {
    type : String ,
    required : true , 
    unique : true
  } ,
  password : {
    type : String ,
    required : true , 
  } , 
  avatar : {
    type : String ,
  } ,
  refreshToken : {
    type : String ,
  }

} , {timestamps : true})

export const User = model('User' , userSchema)