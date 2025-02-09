import { Schema , model } from "mongoose";

const userSchema = new Schema({
  name : {
    type : String ,
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
    unique : true , 
    select : false  ,
  } , 
  avatar : {
    type : String ,
  } ,
  refreshToken : {
    type : String ,
    unique : true , 
    required : true , 
  }

} , {timestamps : true})

export const User = model('User' , userSchema)