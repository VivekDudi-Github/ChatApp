import { Schema , Types, model } from "mongoose";

const RequestSchema  = new Schema({
  sender : {
    type : Schema.Types.ObjectId ,
    ref : 'User' ,
    required : true
    } , 
  reciever : {
    type : Schema.Types.ObjectId , 
    ref : 'User' , 
    required : true
  } , 
  status : {
    type : String , 
    default : 'pending' ,
    enum : ['pending' , 'rejected' , 'accepted']
  }

} , {timestamps : true})

export const Request = model('Request' , RequestSchema)