import { Avatar, Box, Typography } from '@mui/material'
import moment from 'moment';
import React, { memo, useRef, useState } from 'react'
import { fileFormat } from '../components/hook/features';
import RenderAttachment from './RenderAttachments';
import { useDispatch } from 'react-redux';
import { setIsMessageMenu } from '../redux/reducer/misc';
import MessageMenu from '../components/dialogs/MessageMenu';

function MessageComponent({data , user , SenderDetail , ContextHandler}) {
  const dispatch = useDispatch() ;
  
  const {sender , content , createdAt , attachment , _id} = data ;
  const SameSender = SenderDetail ? SenderDetail._id === user._id : null ;
  
  const date = moment(createdAt).fromNow() ;
  
  return (
   <>
      <div style={{
          alignSelf : SameSender ? "flex-end" : "flex-start" ,
          color : 'white' , 
          background : 'rgba(0,0,0,9)' ,
          borderRadius : '5px' , 
          padding : '0.5rem' , 
          maxWidth : '70%' ,
          width : 'content-fit', 
        }}
        onContextMenu={e => ContextHandler(e , _id)}
        >
        {<div style={{ display : 'flex' , width: "100%" , alignItems : 'end' , justifyContent : `${SameSender ? 'end' : 'start'}` , gap : '5px' }}>
          <Avatar sx={{width : '30px' , height : '30px'}} src={SenderDetail?.avatar?.url} />
          <Typography color='rgba(150,20,200,0.)' fontSize={14} fontWeight={600} variant='caption' >{SenderDetail.name}</Typography>
        </div>
        }

        {sender && 
        <div style={{display : 'flex'  , marginTop : '5px' , alignItems : 'end' , justifyContent : `${SameSender ? 'start' : 'start'}`  }}>
          <Typography >{content}</Typography>
        </div>
        }

        {attachment && attachment.map((a , index) => {
          const url =  a.url ;
          const otherUrl = a.url.replace('upload/dpr_auto/w_150')
          const file = fileFormat(url) 
          
        return( 
        <Box key={index}>
          <a href={url} target='_blank' download style={{color : 'black'}}>{RenderAttachment(otherUrl , file)}</a>
        </Box>
        )
        })}

        <Typography textAlign={SameSender ? 'end' : 'start'} display={'block'} width={'100%'} variant='caption' sx={{color : 'rgba(0255,0255,255,0.5)'}}>{date}</Typography>
      </div>
   </>
  )
}

export default memo(MessageComponent) 