import express from 'express'

import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'
import { v4 as uuid } from "uuid";

import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/event.js';

import { getSockets } from './utils/features.js';
import { Message } from './models/message.model.js';


const port = process.env.PORT
const app = express() ;
const server = createServer(app) 
const io = new Server(server ,{})
const userSocketIDs = new Map 


app.use(express.json({limit : '108kb'}))
app.use(cookieParser())

app.use('/api/v1/user' ,userRouter)
app.use('/api/v1/chat' ,chatRouter)

io.use((socket , next) => {
  
})

io.on('connection' ,(socket) => {
  const user = { _id: "userId" ,name : "mera naam" }
   
  userSocketIDs.set(user._id , socket.id)

  socket.on(NEW_MESSAGE , async({room , members , messages}) => {
    const messgaeForRealTime = {
      _id :  uuid() ,
      sender : {
        _id : user._id ,
        name : user.name 
      } ,
      room : room ,
      createdAt : new Date().toString() ,
      messages 
    }
    
    const messageForDb = {
      sender : user._id ,
      content : 'messages' ,
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
    userSocketIDs.delete(user._id.toString())
  })
})


server.listen(port ,() => {
  console.log('server listening on '+port);  
  ConnectDB() ;
}) 

export {userSocketIDs}