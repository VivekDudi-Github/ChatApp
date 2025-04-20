import express from 'express'

import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from "cloudinary"

import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from './constants/event.js';

import { getSockets } from './utils/features.js';
import { Message } from './models/message.model.js';
import dotenv from 'dotenv';
import { SocketAuthenticator } from './middlewares/socketAuth.js';

dotenv.config()

const port = process.env.PORT
const app = express() ;
const server = createServer(app) 
const io = new Server(server ,{
  cors : {
    origin : "http://localhost:5173" ,
    credentials : true 
  }
})
const userSocketIDs = new Map 


app.use(express.json({limit : '108kb'}))
app.use(cookieParser())


app.use('/api/v1/user' ,userRouter)
app.use('/api/v1/chat' ,chatRouter)

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await SocketAuthenticator(err, socket, next)
  );
});

io.on('connection' ,(socket) => {
   console.log('connection');
   
  userSocketIDs.set(socket.user._id.toString() , socket.id)

  console.log(userSocketIDs);
  
  socket.on(NEW_MESSAGE , async({room , members , message , sender}) => {

    const messgaeForRealTime = {
      _id :  uuid() ,
      sender : sender ,
      room : room ,
      createdAt : new Date().toString() ,
      content : message 
    }
    console.log(message);
    
    const messageForDb = {
      sender : socket.user._id ,
      content : message ,
      room : room
    }
    const membersSocket = getSockets(members)
    
    try {
      const dbMessage = await Message.create(messageForDb)
      io.to(membersSocket).emit(NEW_MESSAGE , {
        message : {...dbMessage._doc , sender} ,
        roomID : room 
     })
    } catch (error) {
      console.log("error while saving message for db" , error);
    }

    
    const otherMember = membersSocket.filter(m => m !== socket.id);
    
    io.to(otherMember).emit(NEW_MESSAGE_ALERT ,{roomID : room})

  } 
)

  socket.on(START_TYPING , ({members , room}) => {
    const membersSocketIds = getSockets(members).filter(s => s !== socket.id ) ; 
    
       
    io.to(membersSocketIds).emit(START_TYPING , {roomID : room})
  })

  socket.on(STOP_TYPING , ({members , room}) => {
    const membersSocketIds = getSockets(members).filter(s => s !== socket.id )  ;
    io.to(membersSocketIds).emit(STOP_TYPING , {roomID : room})

  })

  socket.on("disconnect" , () => {
    console.log("user dissconnected");  
    userSocketIDs.delete(socket.user._id.toString())
  })
})


cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
  api_key : process.env.API_KEY ,
  api_secret : process.env.API_SECRET 
  })


server.listen(port ,() => {
  console.log('server listening on '+port);  
  ConnectDB() ;
}) 

export {userSocketIDs , io}