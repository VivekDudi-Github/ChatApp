import { Schema , Types, model } from "mongoose";

const messageSchema = new Schema({
  content : {
    type : String ,
  } , 
  sender : {
    type : Schema.Types.ObjectId ,
    ref : "User"
  } ,
  room : {
    type : Schema.Types.ObjectId ,
    ref : "Room" ,
    required : true ,
  } ,
  attachment : [{
    url : {
      type : String , 
      required : true ,
    } ,
    public_id : {
    type : String , 
    required : true ,
    } ,
  }]
} , {timestamps : true})

export const Message = model('Message' , messageSchema)