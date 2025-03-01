import { v2 as cloudinary} from "cloudinary";
import { userSocketIDs } from "../app.js";
import fs  from "fs";

export const emitEvent = (req , event , users , data) => {
  console.log('emitting event' ,event);
  
}

export const getSockets = (users = []) => {
   return users.map(user => userSocketIDs.get(user._id.toString()))
}


export const uploadFilesTOCloudinary = async(files =[]) => {
  const promises = files.map((f) => {
    return new Promise((resolve , reject) => {
      cloudinary.uploader.upload(
        f.path ,
        {
          folder : 'CharApp_upload' ,
          use_filename : true 
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
    console.log( '---error-- while uploading files to cloudinary' ,error );
    throw new Error('Error uploading files in cloundinary')
  }  
}

export const deleteFilesTOCloudinary = async(files =[]) => {
  const promise =  files.map(async(f) => {
    await cloudinary.uploader.destroy(f.path)
  })

  try {
    await Promise.all(promise) ;
  } catch (error) {
    console.log('---error-- while deleting file from the cloudinary' ,error);
    throw new Error("Error while deleting files in cloudinary");
    
  }
}