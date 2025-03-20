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
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Chat({room}) {

  const containerRef = useRef(null) ;
  const navigate = useNavigate() ;
  const {user} = useSelector(state => state.auth)
  

  const [pageNo , setPageNo] = useState(1) ;
  const [messages , setMessages] = useState([]) ;
  const [errors , setErrors] = useState([{error : false , isError : false }]) 
  const [ input , setInput] = useState('') ;
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
  } 

  const NewMessageListner = useCallback((data) => {
    setMessages(prev => [...prev , data.message])
   } , [])
   
  const EventHandler = useMemo(() => ({
    [NEW_MESSAGE]: NewMessageListner
  }), [NewMessageListner]);


  UseSocket(socket, EventHandler)

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
      setErrors( prev => [
        ...prev ,
        {
          isError: roomDetails?.isError,
          error: oldMessagesChunk?.error,
          toastText: "Can't fetch the messages at moment",
        }
      ])
    }
    if(oldMessagesChunk.data){
      let data = oldMessagesChunk?.data?.data?.messages
      setOldMessageChunks(prev => [...prev , ...data ])
    }
  } , [roomDetails , oldMessagesChunk]) 
  useErrors(errors)
  console.log(oldMessagesChunks);
  
  

  const handleScroll = () => {
    if(containerRef?.current?.scrollTop === 0){
    
      setPageNo(prev => prev + 1)
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
        {oldMessagesChunks.map((m ,index) => {
            const member = members.find((member) => member._id === m.sender._id )   
            
            return <MessageComponent key={index} data={m}  SenderDetail= {member} user={user}/>
          })
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
          }}>
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
    </>
  )
}

export default AppLayout()(Chat)