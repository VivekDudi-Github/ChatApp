import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StylesComponent';

import MessageComponent from '../shared/MessageComponent';
import {getSocket} from '../components/socket/socket'
import { ALERT, NEW_MESSAGE } from '../components/event';
import { useGetMessagesQuery, useGetRoomDetailsQuery } from '../redux/api/api';
import {useErrors, UseSocket} from '../components/hook/hooks'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import { setIsFileOpen } from '../redux/reducer/misc';
import { START_TYPING, STOP_TYPING } from '../components/Constants/events';
import TypingLoader from '../shared/TypingLoader';


function Chat({room}) {

  const containerRef = useRef(null) ;
  const typingTimeOut = useRef(null) ;

  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;
  const {user} = useSelector(state => state.auth)
  

  const [oldScrollHeight , setOldScrollHeight] = useState(null)
  const [ input , setInput] = useState('') ;
  const [ FileMenuAnchor , setFileMenuAnchor] = useState(null) ;
  
  const [IAmTyping , setIAmTyping] = useState(false) ;
  const [userTyping , setuserTyping] = useState(false) ;



  const [pageNo , setPageNo] = useState(1) ;
  const [TotalPageNo , setTotalPageNo] = useState(1) ;

  const [messages , setMessages] = useState([]) ;
  const [errors , setErrors] = useState([]) 
  const [ oldMessagesChunks , setOldMessageChunks] = useState([]) ;
   

  const socket = getSocket() ;
  const populate= true ;
  const roomDetails = useGetRoomDetailsQuery({room , populate  , skip : !room})

  let oldMessagesChunk = useGetMessagesQuery({roomId : room , pageNo : pageNo })    
  

  
  const members = roomDetails?.data?.data?.members ;

  useEffect(() => {
    return () => {
      setMessages([]) ;
      setInput('') ;
      setOldMessageChunks([]) ;
      setErrors([])
      setPageNo(1)
      setTotalPageNo(1)
    }
  } , [room])


  const SubmitHanlderMessage = (e) => {                     // handler for sending the messages
    e.preventDefault() ;

    let membersIdArray = members.map(m => m._id)
    
    if(!input || !membersIdArray || !room)  return toast.error('Data is being fetched . Please try again')
    
    socket.emit(NEW_MESSAGE ,{room : room , members : membersIdArray , message : input })
    setInput('')
  
  }

  const NewStartTypingListner = useCallback((data) => {     // fuc to set typing message
    if(data.roomID != room) return ;
    setuserTyping(true)
    
   } , [room])

   const StopTypingListner = useCallback((data) => {       // fuc to stop typing message
    if(data.roomID != room) return ;
    setuserTyping(false)
    
   } , [room])

  const NewMessageListner = useCallback((data) => {        // fuc to set messages into state used in small useSocket 
    
    if(data.roomID !== room ) return ;
    setMessages(prev => [...prev , data.message])
   } , [room])  

  const EventHandler = useMemo(() => ({
    [NEW_MESSAGE]: NewMessageListner ,
    [START_TYPING]: NewStartTypingListner ,
    [STOP_TYPING]: StopTypingListner ,
  
  }   
  ), [NewMessageListner]);


  UseSocket(socket, EventHandler)                         //a small hook for handling the messages recieved via socket.io

 
  useEffect(() => {                                       // checks for the errors and set chunks of messages if available
    if (roomDetails.isError){
      setErrors ( [{
        isError: roomDetails?.isError,
        error: roomDetails?.error,
        fallback: () => navigate('/'),
        toastText: "Can't find this room",
      }])
    } 
    if(oldMessagesChunk?.isError){
      setErrors( [
        {
          isError: roomDetails.isError,
          error: oldMessagesChunk.error,
          toastText: "Can't fetch the messages at moment",
        }
      ])
    }
    
    
    //check & set the data in state and prevents the scolling position from changing
    if(!oldMessagesChunk?.isFetching && !oldMessagesChunk?.isError){
      
      
      let data = oldMessagesChunk?.data?.data?.messages
      setTotalPageNo(oldMessagesChunk?.data?.data?.total_pages)
      setOldMessageChunks(prev => [...prev , ...data ])  
      
      setTimeout(() => {
        const newSrollHeight = containerRef.current.scrollHeight ;
        
        containerRef.current.scrollTo({
          top : newSrollHeight - oldScrollHeight || 0 ,
          behavior : 'smooth'
        })
      } , 20)
    }
  } , [roomDetails , oldMessagesChunk]) 

  useErrors(errors)
  

  
  useEffect(() => {                                         //creates a small jump after recieving a message 
    if( containerRef?.current)
      containerRef.current.scrollTo({
        top : containerRef.current.scrollTop + 150 ,
        behavior : 'smooth'
      })  
    } , [messages])

 
  const handleScroll = () => {                             //on scroll it stimulates rerender & increase page no  
    if(containerRef?.current?.scrollTop  === 0 ){
      if(pageNo < TotalPageNo ){
          setOldScrollHeight(containerRef?.current?.scrollHeight)   
          setPageNo(prev => prev + 1)
        }
    }
  }


  const handleFileOpen = (e) => {
    setFileMenuAnchor(e.currentTarget) 
    dispatch(setIsFileOpen(true))
  }

  const inputChangeHandler = (e) => {
    setInput(e.target.value) ;
    const membersId = members.map((m) => m._id )  
    if(!IAmTyping){
      socket.emit(START_TYPING , { members : membersId , room}) ;
      setIAmTyping(true) 
    }
    if(typingTimeOut.current) clearTimeout(typingTimeOut.current)

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING  ,{ members : membersId , room})
      setIAmTyping(false)
    } , [3000])
  }

  

  return roomDetails.isLoading ? 
  (<Skeleton/>
    ) : (
    <>
        <Stack
        onScroll={handleScroll}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        height={"90%"}
        sx={{
          background : 'linear-gradient(to top , rgba( 0,0,0 , 0.2) , #fff )' ,
          overflowX: "hidden",
          overflowY: "auto",
        }}
        ref={containerRef}
        >
          {oldMessagesChunks.map((m ,index) => {
              const member = members.find((member) => member._id === m.sender._id )   
              
              
              return <MessageComponent key={index} data={m}  SenderDetail= {member} user={user}/>
            }).reverse()
          }

          {
            messages.map((m ,index) => {
              const member = members.find((member) => member._id === m.sender )
              return <MessageComponent key={ m._id} data={m} SenderDetail = {member} user={user}/>
            })
          }

          {userTyping && <TypingLoader />}
        
        </Stack>
        
      <form onSubmit={(e) => SubmitHanlderMessage(e)} style={{height : '10%'}}>
        <Stack bgcolor={'rgba(0,0,0,0.2)'} direction={'row'} height={'100%'} p={'0.5rem'} alignItems={'center'} position={'relative'}>
          <IconButton sx={{
            position : 'absolute' , 
            left : '0.9rem' , 
            color : 'rgb(200,200,200,9)'
          }}
          onClick={(e) => handleFileOpen(e)}
          >
            <AttachFile />
          </IconButton>
          
          <InputBox placeholder='Type message here...' value={input} onChange={inputChangeHandler} />

          <IconButton type='submit' sx={{
            backgroundColor : '#000' , 
            color : '#aaa' ,
            transitionDuration : '200ms' ,
            ':hover' : {
              backgroundColor : '#999' , 
              color : '#000' ,
            }
            }}>
            <SendIcon />
          </IconButton>
        </Stack>

      </form>
      <FileMenu anchorEl={FileMenuAnchor} RoomId={room}/>
    </>
  )
}

export default AppLayout()(Chat)