import express from "express";
import { CheckAuth, UserloginController, UserSearchController , sendRequest , UserLogOutController, UserSignUpController, AnswersRequest, GetMyFriends } from "../controllers/user.controller.js";
import { checkUser } from "../utils/checkUser.js";
import { singleAvatar } from "../middlewares/multer.js";

const router =  express.Router() ;

router.post('/login' , UserloginController )
router.post('/signup' ,singleAvatar , UserSignUpController )
router.get('/check-health' , checkUser , CheckAuth)
router.get('/logout' , UserLogOutController)

router.get('/search' ,checkUser , UserSearchController)
router.put('/request' , checkUser , sendRequest)
router.patch('/request' , checkUser , AnswersRequest)
router.get('/friends' , checkUser , GetMyFriends)


export default router