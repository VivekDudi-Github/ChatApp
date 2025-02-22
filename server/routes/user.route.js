import express from "express";
import { CheckAuth, UserloginController, UserSearchController , sendRequest , UserLogOutController, UserSignUpController, AnswersRequest } from "../controllers/user.controller.js";
import { checkUser } from "../utils/checkUser.js";

const router =  express.Router() ;

router.post('/login' , UserloginController )
router.post('/signup' , UserSignUpController )
router.get('/check-health' , checkUser , CheckAuth)
router.get('/logout' , UserLogOutController)

router.get('/search' ,checkUser , UserSearchController)
router.put('/request' , checkUser , sendRequest)
router.patch('/request' , checkUser , AnswersRequest)

export default router