import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Stack } from '@mui/material'
import { AttachFile, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StylesComponent';
import { SampleMessage } from '../shared/data';
import MessageComponent from '../shared/MessageComponent';

const user = {
  name : 'Abc' , 
  user_id : '12345'
}
function Chat() {
  const containerRef = useRef(null) ;
  return (
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
      <form onSubmit={e => e.preventDefault()} style={{height : '10%'}}>
        <Stack bgcolor={'rgba(0,0,0,0.2)'} direction={'row'} height={'100%'} p={'0.5rem'} alignItems={'center'} position={'relative'}>
          <IconButton sx={{
            position : 'absolute' , 
            left : '0.9rem' , 
            color : 'rgb(200,200,200,9)'
          }}>
            <AttachFile />
          </IconButton>
          
          <InputBox />

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