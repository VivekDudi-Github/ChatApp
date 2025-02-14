import express from "express";
import { checkUser } from "../utils/checkUser.js";
import { newGroupController } from "../controllers/chat.controller.js";

const router =  express.Router() ;

router.post('/new' ,checkUser , newGroupController)

export default router