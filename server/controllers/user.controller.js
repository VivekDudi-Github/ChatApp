import { User } from "../models/user.model.js"

export const UserSignUpController = async( req, res) => {
  const {name} = req.body
  console.log(name);
  
  res.send(name)
  
  // await User.create({})
}

export const UserloginController = async( req, res) => {

}

