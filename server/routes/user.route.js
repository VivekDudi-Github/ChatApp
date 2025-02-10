import express from "express";
import { UserloginController , UserSignUpController } from "../controllers/user.controller.js";

const router =  express.Router() ;

router.post('/login' , UserloginController )
router.post('/signup' , UserSignUpController )


export default router