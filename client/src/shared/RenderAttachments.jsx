import { FileOpen } from '@mui/icons-material';
import React from 'react'

function RenderAttachments(url , file) {
  switch (file) {
    case 'video':
      return <video src={url} preload='none' width={'200px'} controls></video>
      

    case 'image' :
      return <img src={url} width={'200px'} height={'150px'} style={{objectFit : 'cover'}}/>
      

    case 'audio' : 
      return <audio src={url} preload='none' controls  />

    default:
      return <FileOpen />
      
  }
  
}

export default RenderAttachments