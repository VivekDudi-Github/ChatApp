import express from 'express'
import userRouter from './routes/user.route.js'
import { ConnectDB } from './connectDB.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT
const app = express() ;
app.use(express.json({limit : '108kb'}))
app.use(cookieParser())

app.use('/api/v1/user' ,userRouter)

app.listen(port ,() => {
  console.log('server listening on '+port);  
  ConnectDB() ;
})