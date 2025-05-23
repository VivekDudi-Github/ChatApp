import { v2 as cloudinary} from "cloudinary";
import { userSocketIDs } from "../app.js";
import fs  from "fs";
import { ErrorHandler } from "./utils.js";
import { io } from "../app.js";


export const emitEvent = (req , event , users , data) => {
  console.log('emitting event' ,event);
  const StringifiedUsers = users.map((u) => u.toString())
  
  const memebersSocket = getSockets(StringifiedUsers)
  io.to(memebersSocket).emit(event ,data)
}

export const getSockets = (users = []) => {
  
   return users.map(user => userSocketIDs.get(user))
}
 

export const uploadFilesTOCloudinary = async(files =[]) => {
  const promises = files.map((f) => {
    return new Promise((resolve , reject) => {
      cloudinary.uploader.upload(
        f.path ,
        {
          folder : 'CharApp_upload' ,
          use_filename : true ,
          resource_type : "auto"
        } ,
        ( error , result)=> {
          if(error) return reject(error) ;
            resolve(result)
        }
      )
    })
  })

  try {
    const arr = await Promise.all(promises) ;

    const formattedResult =  arr.map((r) => ({
      public_id : r.public_id ,
      url : r.secure_url 
    }))

    files.forEach(f => fs.unlinkSync(f.path))

    return formattedResult
  } catch (error) {
    console.log(files.length);
    
    if(files) files.forEach(f => fs.unlinkSync(f.path))
    console.log( '---error-- while uploading files to cloudinary' ,error );
    throw new ErrorHandler('Error uploading files in cloundinary' , 500)
  }  
}

export const deleteFilesTOCloudinary = async(files =[]) => {
  const promise =  files.map(async(f) => {
    await cloudinary.uploader.destroy(f.public_id )
  })

  try {
    await Promise.all(promise) ;
  } catch (error) {
    console.log('---error-- while deleting file from the cloudinary' ,error);
    throw new Error("Error while deleting files in cloudinary");
  }
}