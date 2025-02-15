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
    const {name , members , avatar} = req.body ;
  
    if(!name){
      return ResError(res ,400 ,'Provide a name first')
    }
    if( members.length < 2){
      return ResError(res , 400 , 'Members must be at least 2')
    }
    if(!avatar){
      return ResError(res ,400 ,'Provide a avatar')
    }

  
    const GroupMembers = [...members , req.userId]

    const group = await Room.create({
      groupChat : true ,
      name : name ,
      creator : req.userId ,
      members : GroupMembers ,
      avatar
    })
    emitEvent(req , ALERT , GroupMembers ,`Welcome to ${name} group`)
    emitEvent(req , REFRETCH_CHATS , members)
    return ResSuccess(res, 201 , group)


} catch (error) {
  console.log(error);
  return ResError(res, 500 , "internal server error")
  }
}

export const getRooms = async( req , res) => {

  try {
    const fetchRooms = await Room.find({members : req.userId})
    .populate('members' , 'name avatar' )

    if(!fetchRooms) {
      return ResError(res , 404 , 'No rooms found')
    }

    const transformRoomsData = fetchRooms.map(({members ,groupChat , avatar , _id , name }) => {
      return {
        name : groupChat ? name 
        : members[0].name ,
        groupChat ,
        _id ,
        avatar : groupChat ? avatar : members[0].avatar ,
        members : members.reduce() 
      }
    })

    return ResSuccess(res , 200 , transformRoomsData)

  } catch (error) {
    console.log('error while Getiing new Chats :' ,error );
    return ResError(res , 500 , "internal server error")
  }
}

export const getMyGroups = async( req , res) => {
  try {
    const MyGroup = await Room.find({creator : req.userId})
    .populate('members' , 'name avatar' )

    return ResSuccess(res , 200 , MyGroup)

  } catch (error) {
    console.log('error in getting Mygroup', error);
    return ResError(res , 400 , 'internal server error')    
  }
}

export const addMembers = async (req , res) => {
  try {
    const {members , id } = req.body ;
    if(!members || !id ) {
      return ResError(res ,400 , "members and id is required")
    }

    const newGroupData = await Room.findOneAndUpdate({_id : id , creator : req.userId} , 
      {
        $addToSet : {
          members : members 
        }
      } ,
      { new : true }
    )
    if(!newGroupData) {
      return ResError(res , 404, 'group not found')
    }

    return ResSuccess(res ,200 , newGroupData)

  } catch (error) {
    console.log('error in addding members for group'  , error);
    return ResError(res , 500 , 'internal server error')
  }
}

export const removeMembers = async(req, res) => {
  try {
    const {members , id } = req.body ;
    if(!members || !id ) {
      return ResError(res ,400 , "members and id is required")
    }

    const newGroupData = await Room.findOneAndUpdate({_id : id , creator : req.userId} , 
      {
        $pull : {
          members : 
          { $in : members} 
        }
      } ,
      { new : true }
    )
    if(!newGroupData) {
      return ResError(res , 404, 'group not found')
    }

    return ResSuccess(res ,200 , newGroupData)

  } catch (error) {
    console.log('error in addding members for group'  , error);
    return ResError(res , 500 , 'internal server error')
  }
}

