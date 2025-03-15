import express from 'express'

import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from "cloudinary"

import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/event.js';

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
   
  userSocketIDs.set(socket.user._id.toString() , socket.id)
  
  
  socket.on(NEW_MESSAGE , async({room , members , message}) => {
    
    
    const messgaeForRealTime = {
      _id :  uuid() ,
      sender : socket.user._id ,
      room : room ,
      createdAt : new Date().toString() ,
      message 
    }
    console.log(message);
    
    const messageForDb = {
      sender : socket.user._id ,
      content : message ,
      room : room
    }
    const membersSocket = getSockets(members)
    console.log(membersSocket);
    
    io.to(membersSocket).emit(NEW_MESSAGE , {
       message : messgaeForRealTime ,
       room 
    })
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT ,{room})

    try {
      await Message.create(messageForDb)
    } catch (error) {
      console.log("error while saving message for db" , error);
    }
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

export {userSocketIDs}