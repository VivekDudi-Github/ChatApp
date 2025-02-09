import e from "express";
import { UserloginController , UserSignUpController } from "../controllers/user.controller.js";

const router =  e.Router() ;

router.post('/login' , UserloginController )
router.post('/signup' , UserSignUpController )


export default router