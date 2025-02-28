import { Schema , model } from "mongoose";

const userSchema = new Schema({
  email : {
    type : String ,
    unique : true ,
    required : true
  } ,
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
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
    url : {
      type: String , 
      required : true ,
    } ,
    public_id : {
      type: String , 
      required : true ,
    }
  } ,
  refreshToken : {
    type : String ,
  }

} , {timestamps : true})

export const User = model('User' , userSchema)