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
import { setIsFileOpen, setIsMessageMenu } from '../redux/reducer/misc';
import { DELETE_MESSAGE, START_TYPING, STOP_TYPING } from '../components/Constants/events';
import TypingLoader from '../shared/TypingLoader';
import MessageMenu from '../components/dialogs/MessageMenu';


function Chat({room}) {

  const containerRef = useRef(null) ;
  const typingTimeOut = useRef(null) ;

  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;
  const {user} = useSelector(state => state.auth)
  

  const [oldScrollHeight , setOldScrollHeight] = useState(null)
  const [ input , setInput] = useState('') ;
  
  const [FileMenuAnchor , setFileMenuAnchor] = useState(null) ;
  const [MessageAnchor , setMessageAnchor]  = useState(null) ;
  const [MessageId , setMessageId] = useState(null)


  const [IAmTyping , setIAmTyping] = useState(false) ;
  const [userTyping , setuserTyping] = useState(false) ;



  const [pageNo , setPageNo] = useState(1) ;
  const [TotalPageNo , setTotalPageNo] = useState(1) ;

  const [messages , setMessages] = useState([]) ;
  const [errors , setErrors] = useState([]) 
  const [ oldMessagesChunks , setOldMessageChunks] = useState([]) ;
   
  const [members , setMembers] = useState([]) ;

  const socket = getSocket() ;
  const populate= true ;
  const roomDetails = useGetRoomDetailsQuery({room , populate  , skip : !room})

  let oldMessagesChunk = useGetMessagesQuery({roomId : room , pageNo : pageNo })    
  
  const hiddenMessages = JSON.parse(localStorage.getItem('hiddenMessages')) || [] ;
  
  

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
    
    const sender = {
      name : user.name ,
      avatar : {
        url : user.avatar.url ,
      } ,
      _id : user._id 
    }
    socket.emit(NEW_MESSAGE ,{room : room , members : membersIdArray , message : input , sender : sender })
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

  const DeleteMessageListener = useCallback((data) => {
    const {id , roomID} = data ;
    if(!id || !roomID ) return ;
    
    if(room == roomID){
      const index = messages.find(m => m._id.toString() == id.toString())
      if(!index){
      const newArray = oldMessagesChunks.map((message) => 
      message._id.toString() === id.toString() ?
      {
        ...message ,
        content : '' ,
        attachment : ''
      } : message
      )
      setOldMessageChunks(newArray)
    } else {
      const newArray = messages.map((message) => 
        message._id.toString() === id.toString() ?
        {
          ...message ,
          content : '' ,
          attachment : ''
        } : message
        )
        setMessages(newArray)
    }
  }

  } , [room])

  const EventHandler = useMemo(() => ({
    [NEW_MESSAGE]: NewMessageListner ,
    [START_TYPING]: NewStartTypingListner ,
    [STOP_TYPING]: StopTypingListner ,
    [DELETE_MESSAGE] : DeleteMessageListener ,
  }   
  ), [NewMessageListner]);


  UseSocket(socket, EventHandler)                         //a small hook for handling the messages recieved via socket.io

 
  useEffect(() => {                                       // checks for the errors and aset chunks of messages if available
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
      setMembers(roomDetails?.data?.data?.members)

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

  const handleContextMenu = (e , id) => {
    
    setMessageAnchor(e.currentTarget) ;
    setMessageId(id)
    dispatch(setIsMessageMenu(true)) ;
  }
console.log(messages);

  const deleteMessageForEveryoneFunc= (messageId) => {
    const messageIndex = messages.findIndex(message => message._id === messageId)
    const deletedMessage = {
      attachment: '' ,
      content : '' , 
    }
    if(messageIndex !== -1){
      const newArray = messages.map((message => message._id == messageId ? 
        { ...message ,
          ...deletedMessage ,
        } : message 
      ))

      setMessages(newArray) ;
    } else {
      const newArray = oldMessagesChunks.m((message => message._id == messageId ? 
        { ...message ,
          ...deletedMessage
        } : message 
      )) 

      setOldMessageChunks(newArray)
    }
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
          {oldMessagesChunks &&
          oldMessagesChunks
          .sort((a , b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((message ,index) => {
              if(hiddenMessages.includes(message._id.toString())) return ;
              return <MessageComponent key={index} data={message}  SenderDetail= {message.sender} user={user} ContextHandler={handleContextMenu}/>
            }).reverse()
          }

          {messages &&
            messages.map((m ,index) => {
              console.log(messages.length)
              if(hiddenMessages.includes(m._id.toString())) return ;
              return <MessageComponent key={ m._id} data={m} SenderDetail = {m.sender} user={user} ContextHandler={handleContextMenu}/>
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
      <MessageMenu anchorEl={MessageAnchor} messageId={MessageId} pageNo={pageNo} deleteMessageForEveryoneFunc={deleteMessageForEveryoneFunc} roomId={room}/>
    </>
  )
}

export default AppLayout()(Chat)