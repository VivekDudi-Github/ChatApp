import express from 'express'

import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'
import { v4 as uuid } from "uuid";

import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import { NEW_MESSAGE } from './constants/event.js';
import { log } from 'console';



const port = process.env.PORT
const app = express() ;
const server = createServer(app) 
const io = new Server(server ,{})
const userSocketIDs = new Map 


app.use(express.json({limit : '108kb'}))
app.use(cookieParser())

app.use('/api/v1/user' ,userRouter)
app.use('/api/v1/chat' ,chatRouter)


io.on('connection' ,(socket) => {
  const user = { _id: "userId" ,name : "mera naam" }
   
  userSocketIDs.set(user._id , socket.id)
  log(userSocketIDs)

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
    console.log(messageForDb);
    
    console.log(messgaeForRealTime);
    
  })

  socket.on("disconnect" , () => {
    console.log("user dissconnected");  
  })
})


server.listen(port ,() => {
  console.log('server listening on '+port);  
  ConnectDB() ;
}) 