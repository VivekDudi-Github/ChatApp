import { User } from '../models/user.model.js';
import {ErrorHandler} from '../utils/utils.js'
import jwt from "jsonwebtoken";

const SocketAuthenticator = async(err ,socket , next) => {
  try {
    if(err) return next(err)
    
    
      
    const authToken = socket.request.cookies.refreshToken ;
    if(!authToken){
      return next(new ErrorHandler('Please login to access this route' , 401))
    }

    const decodeToken = jwt.verify(authToken , process.env.JWT_KEY)

    const user = await User.findById(decodeToken.userId).select(' -password -refreshToken')
    
    
    if(!user){
      return next( new ErrorHandler('Please login to access this route' , 401))
    }
    socket.user = user
    return next()

  } catch (error) {
    console.log(error);
    
    return next(new ErrorHandler("Please login to access this route" , 401))
  }
}


export {SocketAuthenticator}