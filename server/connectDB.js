import mongoose from "mongoose";
import dotenv  from "dotenv";

dotenv.config({
  path : './.env'
})
export const ConnectDB = async () => {
  try {    
    await mongoose.connect(process.env.MONGODB_URI) ;
    console.log('mongoDB connected');
    
  } catch (error) {
    console.log('---error in connecting with the mongoDB servers : --' , error)
    process.exit()
  }
}