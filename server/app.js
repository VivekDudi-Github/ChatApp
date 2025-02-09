import express from 'express'
import userRouter from './routes/user.route.js'

const app = express() ;

app.use('/api/v1/user' ,userRouter)

app.listen(3000 ,() => {
  console.log('server listening on 3000');
  
})