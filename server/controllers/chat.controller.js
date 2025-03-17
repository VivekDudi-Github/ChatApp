import { Room} from "../models/room.model.js"
import {ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFRETCH_CHATS}  from '../constants/event.js'
import {emitEvent} from "../utils/features.js"
import { User } from "../models/user.model.js"
import { Message } from "../models/message.model.js"

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
const TryCatch = (func , name) => {
  return async ( req ,res, ...args) => {
    try {
      return await func(req , res ,...args)
    } catch (error) {
      console.log('error while '+name ,error);
      return ResError(res, 500 , 'internal server error')   
    }
  }
}

const newGroupController = async( req, res) => {
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
  return ResError(res, 500 , "internal server error" )
  }
}

const getRooms = TryCatch( async( req , res) => {

    const fetchRooms = await Room.find({members : req.userId})
    .populate('members' , 'name avatar' )

    if(!fetchRooms) {
      return ResError(res , 404 , 'No rooms found')
    }
    const transformRoomsData = fetchRooms.map(({ members , groupChat , avatar , _id , name }) => {
      return {
        name : groupChat ? name 
        : members[0].name ,
        groupChat ,
        _id ,
        avatar : groupChat ? avatar : members[0].avatar ,
        members : members 
      }
    })

    return ResSuccess(res , 200 , transformRoomsData)

} , 'getRooms' )

const getMyGroups = async( req , res) => {
  try {
    const MyGroup = await Room.find({creator : req.userId})
    .populate('members' , 'name avatar' )

    return ResSuccess(res , 200 , MyGroup)

  } catch (error) {
    console.log('error in getting Mygroup', error);
    return ResError(res , 400 , 'internal server error')    
  }
}

const addMembers = async (req , res) => {
  try {
    const {members  } = req.body ;
    const {id} = req.params ;
    
    if(!members || !id ) {
      return ResError(res ,400 , "members and group id is required")
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

const removeMembers = async(req, res) => {
  try {
    const {members} = req.body ;
    const {id} = req.params ;

    if(!members || !id ) {
      return ResError(res ,400 , "members and id is required")
    }
    if(members.includes(req.userId._id.toString())){
      return ResError(res , 400 , 'You can not remove yourself')
    }

    const membersName = [] ;

    for (const m of members) {
      const user = await User.findById(m , 'name')
      membersName.push(user.name)
    }
    
    const newGroupData = await Room.findOneAndUpdate({
      _id : id ,
      groupChat : true , 
      creator : req.userId ,
      $expr : {$gt : [{$size : "$members"} , 3]}
    } , 
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

    emitEvent( req ,ALERT ,newGroupData.members , `${membersName.join()} were remove from the group`)

    return ResSuccess(res ,200 ,  newGroupData

    )

  } catch (error) {
    console.log('error in addding members for group' , error);
    return ResError(res , 500 , 'internal server error')
  }
}

const renameGroup =  async(req ,res) => {
  try {
    const {name} = req.body ;
    const {id} = req.params ;

    if(!name || !id){
      return ResError(res, 400 , 'new name and group id not found')
    }

    const renamedGroup = await Room.findOneAndUpdate({_id : id , groupChat : true , creator : req.userId} , 
      {$set : {
        name : name
      }} ,
      {new : true}
    )
    if(!renamedGroup){
      return ResError(res , 404 , 'wrong credentials or unauthorized request')
    }
    
    return ResSuccess(res , 200 , renamedGroup)
    
  } catch (error) {
    console.log('error while renaming group name' , error);
    return ResError(res , 500 , 'internal server error')    
  }
}

const deleteRoom =  async(req , res) => {
  try {
    const {id} =  req.params ;
  
    const result  = await Room.deleteOne({_id : id , creator : req.userId })

    if (result.deletedCount === 0) {
      return ResError(res, 404, 'Room not found or you do not have permission to delete it');
    }
    const messages = await Message.deleteOne({room : id})

    return ResSuccess(res , 200 , 'Room removed')

  } catch (error) {
    console.log('error while deleting the room' , error);
    return ResError(res , 500 , "internal server error")
  }
}

const leaveGroup =  async(req , res) => {
  try {
    const {id} = req.params ;
    
    const group = await Room.findOne({_id : id , members : { $in : req.userId._id}})
    
    if(!group){
      return ResError(res, 404 , 'no group found with your credetials')
    }
    
    if(group.creator.toString() === req.userId._id.toString()){
      return ResError(res , 400 , 'can not leave group without changing the creator')
    }

    group.members = group.members.filter((m) => m.toString() !== req.userId._id.toString() )
    
    if(!group){
      return ResError(res , 400 ,"can't find the group")
    }

    await group.save() ;
    return ResSuccess(res , 200 , group)

  } catch (error) {
    console.log('error while leaving group' , error);
    return ResError(res , 500 , 'internal server error')
  }
}

const sendAttachments= async ( req , res) => {
  try {
    const {id} = req.params ;

    const room =  await Room.findById(id) ;
    const user = await User.findById(req.userId) ;

    if(!room){
      return ResError(res , 404 , 'no group found') 
    }
    if(!room.members.includes(user._id)){
      return ResError(res, 403 , 'person is not a memeber')
    }

    // const files = req.files || [];

    // if(files.length < 1) {
    //   return ResError(res, 400 ,'please provide attachments')
    // }

    //upload files 

    const attachment = ['mean' ,'median' ,'mode'] ;

    const messageForSocket = {
      content : '' , 
      attachment : attachment ,
      sender : { id : req.userId ,name : user.name} ,
      room : id       
    }  ;

    const messageForDB = {
      content : '' , 
      attachment :attachment,
      sender : req.userId ,
      room : id 
    } ;

    const message = await Message.create(messageForDB);


    emitEvent(req , NEW_ATTACHMENT , room.members , {
      message : messageForSocket ,
      roomId : id ,
    })

    emitEvent(req, NEW_MESSAGE_ALERT , room.members , {
      room_id : room._id ,
    })

    return ResSuccess(res, 200 , message)

  } catch (error) {
    console.log('error while sending the attachements' , error);
    return ResError(res , 500 ,'internal server error')
  }
}

const getMessages =  TryCatch(async( req, res) => {  
  const {id} = req.params ;
  const {page = 1} = req.query ;

  const limit = 50 ;
  const skip = (page-1)*limit ;
  

  if(!page){
    return ResError(res, 400 , 'no query provided')
  }

  const messages = await Message.find({room : id})
  .sort({createdAt : -1})
  .skip(skip) 
  .limit(limit)
  .populate('sender' , 'avatar name')
  .lean()

  if(!messages){
    return ResError(res, 500 , 'an error ocurred while fetching messages')
  }
  const totalMessage = await Message.countDocuments({room : id})
  const total_pages = Math.ceil(totalMessage / limit) ;

  return ResSuccess(res, 200 , {
    messages : messages ,
    total_pages 
  })

} , 'getMessage')

const getRoomDetails = TryCatch( async(req, res) => {
  
  if(req.query.populate === 'true'){
        
    const MyRoom =  await Room.findById(req.params.id).populate('members' , 'name avatar')
    
    if(!MyRoom){
      return ResError(res, 404 , 'Room not found')
    }
    return ResSuccess(res, 200 ,MyRoom)
  
  }else{
    const MyRoom =  await Room.findById(req.params.id)
    if(!MyRoom){
      return ResError(res ,404 , 'room not found')
    }
    return ResSuccess(res , 200 , MyRoom)
  }

} , 'getChatDetails')


export {
    getMessages ,
    getRoomDetails , 
    sendAttachments , 
    leaveGroup , 
    deleteRoom ,
    renameGroup ,
    removeMembers , 
    addMembers ,
    getMyGroups , 
    newGroupController , 
    getRooms , 
  }