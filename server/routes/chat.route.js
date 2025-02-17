import express from "express";
import { checkUser } from "../utils/checkUser.js";
import { newGroupController , getRooms ,getMyGroups ,addMembers, removeMembers, deleteRoom, renameGroup, leaveGroup, sendAttachments } from "../controllers/chat.controller.js";
import { sendAttachmentsMulter } from "../middlewares/multer.js";


const router =  express.Router() ;

router.post('/new-group' ,checkUser , newGroupController)
router.get('/rooms' , checkUser , getRooms)
router.get('/my-group' ,checkUser , getMyGroups)
router.put('/members/:id' , checkUser , addMembers)
router.delete('/members/:id' , checkUser , removeMembers)
router.patch('/rename/:id' , checkUser , renameGroup)
router.delete('/room/:id' , checkUser , deleteRoom)
router.post('/leave/:id' , checkUser , leaveGroup)

router.post('/message/:id' , checkUser ,sendAttachmentsMulter , sendAttachments)

export default router