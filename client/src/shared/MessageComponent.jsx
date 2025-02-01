import { Box, Typography } from '@mui/material'
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../components/hook/features';
import RenderAttachments from './RenderAttachments';

function MessageComponent({message , user}) {
  const {sender , content , createdAt , attachments} = message ;
  
  
  const date = moment(createdAt).fromNow() ;
  return (
    <div style={{
      alignSelf : sender.user_id === user.user_id ? "flex-end" : "flex-start" ,
      color : 'black' , 
      borderRadius : '5px' , 
      padding : '0.5rem' , 
      width : 'fit-content'
      
    }}>
    {sender.user_id !== user.user_id && 
    <Typography color='rgba(0,0,200,0.5)' fontWeight={600} variant='caption' >{sender.name}</Typography>
    }

    {sender && <Typography>{content}</Typography>}

    {attachments.length > 0 && attachments.map((a , index) => {
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