import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StylesComponent';

import MessageComponent from '../shared/MessageComponent';
import {getSocket} from '../components/socket/socket'
import { NEW_MESSAGE } from '../components/event';
import { useGetMessagesQuery, useGetRoomDetailsQuery } from '../redux/api/api';
import {useErrors, UseSocket} from '../components/hook/hooks'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import { setIsFileOpen } from '../redux/reducer/misc';


function Chat({room}) {

  const containerRef = useRef(null) ;
  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;
  const {user} = useSelector(state => state.auth)
  

  const [pageNo , setPageNo] = useState(1) ;
  const [oldScrollHeight , setOldScrollHeight] = useState(null)
  
  const [messages , setMessages] = useState([]) ;
  const [errors , setErrors] = useState([{error : false , isError : false }]) 
  const [ input , setInput] = useState('') ;
  const [ FileMenuAnchor , setFileMenuAnchor] = useState(null) ;
  const [ oldMessagesChunks , setOldMessageChunks] = useState([]) ;
   

  const socket = getSocket() ;
  const populate= true ;
  const roomDetails = useGetRoomDetailsQuery({room , populate  , skip : !room})

  const oldMessagesChunk = useGetMessagesQuery({roomId : room , pageNo : pageNo })
  
  
  
  const members = roomDetails?.data?.data?.members ;

  
  const SubmitHanlderMessage = (e) => {
    e.preventDefault() ;

    if(!input) return ;
    let membersIdArray = members.map(m => m._id)
    if(!input || !membersIdArray || !room)  return toast.error('Data is being fetched . Please try again')
    socket.emit(NEW_MESSAGE ,{room : room , members : membersIdArray , message : input })
    setInput('')
  }   // handler for sending the messages

  
  const NewMessageListner = useCallback((data) => {
    setMessages(prev => [...prev , data.message])
   } , [])   // fuc to set messages into state used in small useSocket 

  const EventHandler = useMemo(() => ({
    [NEW_MESSAGE]: NewMessageListner
  }), [NewMessageListner]);


  UseSocket(socket, EventHandler)     //a small hook for handling the messages recieved via socket.io
  console.log(socket.id);
  

  // checks for the errors and set chunks of messages if available
  useEffect(() => {
    if (roomDetails.isError){
      setErrors ( [{
        isError: roomDetails?.isError,
        error: roomDetails?.error,
        fallback: () => navigate('/'),
        toastText: "Can't find this room",
      }])
    } 
    if(oldMessagesChunk.isError){
      setErrors( [
        {
          isError: roomDetails.isError,
          error: oldMessagesChunk.error,
          toastText: "Can't fetch the messages at moment",
        }
      ])
    }

    //check & set the data in state and prevents the scolling position from changing
    if(!oldMessagesChunk.isFetching && !oldMessagesChunk.isError){
      let data = oldMessagesChunk?.data?.data?.messages
      setOldMessageChunks(prev => [...prev , ...data ])  

      setTimeout(() => {
        const newSrollHeight = containerRef.current.scrollHeight ;
       
         containerRef.current.scrollTop = newSrollHeight - oldScrollHeight || 0 ;
      } , 20)
    }
  } , [roomDetails , oldMessagesChunk]) 
  useErrors(errors)
  

  //creates a small jump after recieving a message 
  useEffect(() => {
    if( containerRef?.current)
      containerRef.current.scrollTop =containerRef.current.scrollTop + 100 
    } , [messages])


  //on scroll it stimulates rerender & increase page no  
  const handleScroll = () => {
    if(containerRef?.current?.scrollTop === 0 ){
      if(pageNo < oldMessagesChunk?.data?.data.total_pages ){
          setOldScrollHeight(containerRef?.current?.scrollHeight)   
          setPageNo(prev => prev + 1)
        }
    }
  }

  const handleFileOpen = (e) => {
    setFileMenuAnchor(e.currentTarget)
    dispatch(setIsFileOpen(true))
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
          
          <InputBox placeholder='Type message here...' value={input} onChange={e => setInput(e.target.value)} />

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