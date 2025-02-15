import express from "express";
import { checkUser } from "../utils/checkUser.js";
import { newGroupController , getRooms ,getMyGroups ,addMembers, removeMembers } from "../controllers/chat.controller.js";


const router =  express.Router() ;

router.post('/new-group' ,checkUser , newGroupController)
router.get('/rooms' , checkUser , getRooms)
router.get('/my-group' ,checkUser , getMyGroups)
router.put('/members' , checkUser , addMembers)
router.delete('/members' , checkUser , removeMembers)
export default router