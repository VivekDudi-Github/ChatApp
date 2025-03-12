import io from "socket.io-client";
import {  createContext, useContext, useMemo} from "react";



const SocketContext = createContext() ;

const getSocket = () => useContext(SocketContext)


const SocketProvider = ({ children}) => {
  const socket =  useMemo(() => (
    io('http://localhost:3000' , {
      withCredentials : true ,
    })
  ) , [])  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export {getSocket , SocketProvider}