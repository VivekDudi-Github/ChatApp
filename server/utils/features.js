import { userSocketIDs } from "../app.js";

export const emitEvent = (req , event , users , data) => {
  console.log('emitting event' ,event);
  
}

export const getSockets = (users = []) => {
   return users.map(user => userSocketIDs.get(user._id.toString()))
}