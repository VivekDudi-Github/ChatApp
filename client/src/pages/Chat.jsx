import React, { useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StylesComponent';
import { SampleMessage } from '../shared/data';
import MessageComponent from '../shared/MessageComponent';
import {getSocket} from '../socket'
import { NEW_MESSAGE } from '../components/event';
import { useGetRoomDetailsQuery } from '../redux/api/api';

const user = {
  name : 'Abc' , 
  user_id : '12345'
}
function Chat({room}) {
  const containerRef = useRef(null) ;

  
  
  const [ input , setInput] = useState('') ;
  
  const socket = getSocket() ;
  const roomDetails = useGetRoomDetailsQuery({room , skip : !room})


  const members = roomDetails?.data?.data?.members ;
  const SubmitHanlderMessage = (e) => {
    e => e.preventDefault() ;

    if(!input) return ;

    socket.emit(NEW_MESSAGE ,{room : room , members : members , message : input })
    setInput('')
  }

  return roomDetails.isLoading ? 
  (<Skeleton/>
    ) : (
    <>
      <Stack
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

        {
          SampleMessage.map((m ,index) => {

            return <MessageComponent key={ index} message={m} user={user}/>
          })
        }
      
      </Stack>
      <form onSubmit={SubmitHanlderMessage} style={{height : '10%'}}>
        <Stack bgcolor={'rgba(0,0,0,0.2)'} direction={'row'} height={'100%'} p={'0.5rem'} alignItems={'center'} position={'relative'}>
          <IconButton sx={{
            position : 'absolute' , 
            left : '0.9rem' , 
            color : 'rgb(200,200,200,9)'
          }}>
            <AttachFile />
          </IconButton>
          
          <InputBox placeholder='Type message here...' onChange={e => setInput(e.target.value)} />

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