import express from 'express'
import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT
const app = express() ;

app.use(express.json({limit : '108kb'}))
app.use(cookieParser())

app.use('/api/v1/user' ,userRouter)
app.use('/api/v1/chat' ,chatRouter)


app.listen(port ,() => {
  console.log('server listening on '+port);  
  ConnectDB() ;
})