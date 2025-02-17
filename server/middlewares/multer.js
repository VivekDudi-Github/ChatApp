import multer from 'multer'

const multerUpload = multer({
  limits : {
    fieldSize : 1024*1024*5 ,
  }
})

const singleAvatar =  multerUpload.single('avatar')

const sendAttachmentsMulter = multerUpload.array('files' ,5)

export {singleAvatar ,sendAttachmentsMulter}