import { Room } from "../models/room.model.js"
import {ALERT, REFRETCH_CHATS}  from '../constants/event.js'
import {emitEvent} from "../utils/features.js"

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

export const newGroupController = async( req, res) => {
try {
    const {name , members} = req.body ;
  
    if(!name){
      return ResError(res ,400 ,'Provide a name first')
    }
    if( members.length < 2){
      return ResError(res , 400 , 'Members must be at least 2')
    }
  
    const GroupMembers = [...members , req.userId]

    const group = await Room.create({
      groupChat : true ,
      name : name ,
      creator : req.userId ,
      members : GroupMembers
    })
    emitEvent(req , ALERT , GroupMembers ,`Welcome to ${name} group`)
    emitEvent(req , REFRETCH_CHATS , members)
    return ResSuccess(res, 201 , group)


} catch (error) {
  console.log(error);
  return ResError(res, 500 , "internal server error")
  }
}