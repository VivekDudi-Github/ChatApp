import mongoose, { Schema , model } from "mongoose";

const roomSchema = new Schema({
  groupChat : {
    type : Boolean , 
    default : true ,
  } , 
  name : {
    type : String , 
    required : true ,
  } ,
  creator : {
    type : mongoose.Types.ObjectId , 
    ref : "User" ,
    required : true ,
  } , 
  members : [{
    type : mongoose.Schema.Types.ObjectId , 
    ref : "User" ,
  }]

} , {timestamps : true})

export const Room = model('Room' , roomSchema)