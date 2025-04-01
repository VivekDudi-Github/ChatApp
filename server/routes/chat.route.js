import express from "express";
import { checkUser } from "../utils/checkUser.js";
import { newGroupController , getRooms ,getMyGroups, getRoomDetails ,addMembers, removeMembers, deleteRoom, renameGroup, leaveGroup, sendAttachments, getMessages } from "../controllers/chat.controller.js";
import { sendAttachmentsMulter } from "../middlewares/multer.js";


const router =  express.Router() ;

router.post('/new_group' ,checkUser , newGroupController)
router.get('/rooms' , checkUser , getRooms)
router.get('/my_group' ,checkUser , getMyGroups)
router.put('/members/:id' , checkUser , addMembers)
router.delete('/members/:id' , checkUser , removeMembers)
router.put('/rename/:id' , checkUser , renameGroup)
router.delete('/room/:id' , checkUser , deleteRoom)
router.post('/leave/:id' , checkUser , leaveGroup) 

router.post('/message/:id' , checkUser ,sendAttachmentsMulter , sendAttachments)
router.get('/:id' , checkUser , getRoomDetails)
router.get('/message/:id' , checkUser , getMessages)
export default router