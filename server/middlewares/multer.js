import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerUpload = multer({
  storage 
})

const singleAvatar =  multerUpload.single('avatar')

const sendAttachmentsMulter = multerUpload.array('files' ,5)

export {singleAvatar ,sendAttachmentsMulter}