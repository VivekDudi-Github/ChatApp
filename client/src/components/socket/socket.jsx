import {  createContext, useContext , useEffect , useState} from "react";
import toast from "react-hot-toast";
// import socketConnect from "./createSocket";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { LayoutLoader } from "../layout/Loaders";

const SocketContext = createContext() ;

const getSocket = () => useContext(SocketContext)
// const socket = socketConnect() ;

const SocketProvider = ({ children}) => {
  const {user} = useSelector(state => state.auth)
  const [socket , setSocket] = useState(null) ;



  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      setSocket(null);
      return;
    }
    if(user){
      const toastId =  toast.loading('connecting')
      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
      });
      setSocket(newSocket) ;
      {toast.success("connected" , {id : toastId})}
    }
    return () => {
      if(socket) socket.disconnect() ;
    }
  } , [user])

    
    return !socket ? 
    (<LayoutLoader/>
    ) 
    :(
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider> 
  )
}


export {getSocket , SocketProvider}