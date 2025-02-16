import express from "express";
import { checkUser } from "../utils/checkUser.js";
import { newGroupController , getRooms ,getMyGroups ,addMembers, removeMembers, deleteRoom, renameGroup } from "../controllers/chat.controller.js";


const router =  express.Router() ;

router.post('/new-group' ,checkUser , newGroupController)
router.get('/rooms' , checkUser , getRooms)
router.get('/my-group' ,checkUser , getMyGroups)
router.put('/members/:id' , checkUser , addMembers)
router.delete('/members/:id' , checkUser , removeMembers)
router.patch('/rename/:id' , checkUser , renameGroup)
router.delete('/room/:id' , checkUser , deleteRoom)


export default router