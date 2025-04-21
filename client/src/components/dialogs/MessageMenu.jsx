import { Menu, MenuItem } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMessageMenu } from '../../redux/reducer/misc';
import { UseAsyncMutation } from '../hook/hooks';
import { useDeleteMessageMutation } from '../../redux/api/api';

function MessageMenu({anchorEl , messageId , roomId , pageNo , deleteMessageForEveryoneFunc}) {
  
  const dispatch = useDispatch() ;
  const {isMessageMenu} = useSelector(state => state.misc)
  
  const handleDeleteFromMe = () => {
    const hiddenMessagesArray = JSON.parse(localStorage.getItem('hiddenMessages')) || [] ;

    !hiddenMessagesArray.includes(id) ? hiddenMessagesArray.push(id) : null ;
    localStorage.setItem('hiddenMessages' , JSON.stringify(hiddenMessagesArray) )
    dispatch(setIsMessageMenu(false))
  }

  const [deleteMessage] = UseAsyncMutation(useDeleteMessageMutation)
  
  const handleDeleteFromEveryone = () => {
    if(!messageId || !roomId || !pageNo) return ;
    
    deleteMessage( '',{messageId , roomId, pageNo }) ;
  }

  return (
    <Menu anchorEl={anchorEl} open={isMessageMenu} onClose={() => dispatch(setIsMessageMenu(false))}
   sx={{
   }} 
    >
      <MenuItem 
      sx={{
        transitionDuration : '200ms' ,
        ':hover' : {
          bgcolor : 'rgba(0,0,0,0.2)'
        }
      }}
      onClick={handleDeleteFromEveryone}
      > 
        Delete Chat from everyone
      </MenuItem>
      <MenuItem
      sx={{
        transitionDuration : '200ms' ,
        ':hover' : {
          bgcolor : 'rgba(0,0,0,0.2)'
        }
      }}
      onClick={handleDeleteFromMe}
      >
        Delete Chat from me
      </MenuItem>
    </Menu>
  )
}

export default MessageMenu