import { Avatar, Box, Typography } from '@mui/material'
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../components/hook/features';
import RenderAttachments from './RenderAttachments';

function MessageComponent({content , user , SenderDetail}) {
  const {sender , message , createdAt , attachments} = content ;
  
  const date = moment(createdAt).fromNow() ;
  return (
    <div style={{
      alignSelf : sender === user._id ? "flex-end" : "flex-start" ,
      color : 'black' , 
      borderRadius : '5px' , 
      padding : '0.5rem' , 
      width : 'fit-content'
      
    }}>
    {sender._id !== user._id && 
    <div style={{ display : 'flex' , alignItems : 'end' , gap : '5px' }}>
      <Avatar sx={{width : '30px' , height : '30px'}} src={SenderDetail.avatar} />
      <Typography color='rgba(0,0,200,0.5)' fontSize={14} fontWeight={600} variant='caption' >{SenderDetail.name}</Typography>
    </div>
    }

    {sender && <Typography>{message}</Typography>}

    {attachments && attachments.map((a , index) => {
      const url =  a.url ;
      const file = fileFormat(url)
      
      return( 
      <Box key={index}>
        <a href={url} target='_blank' download style={{color : 'black'}}>{RenderAttachments(url , file)}</a>
      </Box>
      )
      })}

     <Typography variant='caption' color='text.secondary'>{date}</Typography>
    </div>
  )
}

export default memo(MessageComponent) 