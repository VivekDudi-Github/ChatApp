import express from "express";
import { CheckAuth, UserloginController , UserLogOutController, UserSignUpController } from "../controllers/user.controller.js";
import { checkUser } from "../utils/checkUser.js";

const router =  express.Router() ;

router.post('/login' , UserloginController )
router.post('/signup' , UserSignUpController )
router.get('/check-health' , checkUser , CheckAuth)
router.get('/logout' , UserLogOutController)
export default router