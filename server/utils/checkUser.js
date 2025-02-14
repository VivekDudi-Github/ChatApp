import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
import dotenv from 'dotenv'

dotenv.config() ;

export const checkUser = async(req , res , next) => {
  try {
    const inconmingToken = req?.cookies?.refreshToken ;
    
    if(!inconmingToken){
      return res.status(400).json({
        error : 'Token is not available'
      })
    }
    let decoded ;
    try {
      decoded = jwt.verify(inconmingToken , process.env.JWT_KEY)
    } catch (error) {
      return res.status(401).json({
        error : 'Invalid Token'
      })
    }

    const userId = await User.exists({_id : decoded.userId}).select(' -password -refreshToken')
    if(!userId){
      return res.status(401).json({
        error : 'Unauthourized token'
      })
    }
    req.userId = userId ;
    return next() ;

  } catch (error) {
    console.log('error while checking the user' ,error);
    return res.status(500).json({
      error : 'internal server error'
    })
  }
}