import jwt from 'jsonwebtoken' 

export const generateRefreshTokenSetCookies = async (userId , res) => {
  const token =  jwt.sign({userId} , process.env.JWT_KEY , {expiresIn : '5d'})

  res.cookie('refreshToken' , token , {
    maxAge : 5*24*60*60*1000 ,
    httpOnly : true ,
    secure : true ,
  })

  return token 

}