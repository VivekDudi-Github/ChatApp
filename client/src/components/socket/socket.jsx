import {  createContext, useContext} from "react";
import socket from "./createSocket";


const SocketContext = createContext() ;

const getSocket = () => useContext(SocketContext)

const SocketProvider = ({ children}) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider> 
  )
}

export {getSocket , SocketProvider}