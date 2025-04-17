import { Menu, MenuItem } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMessageMenu } from '../../redux/reducer/misc';

function MessageMenu({anchorEl , id}) {
  console.log(anchorEl);
  
  const dispatch = useDispatch() ;
  const {isMessageMenu} = useSelector(state => state.misc)
  
  const handleDeleteFromMe = () => {
    const hiddenMessagesArray = JSON.parse(localStorage.getItem('hiddenMessages')) || [] ;

    !hiddenMessagesArray.includes(id) ? hiddenMessagesArray.push(id) : null ;
    localStorage.setItem('hiddenMessages' , JSON.stringify(hiddenMessagesArray) )
    dispatch(setIsMessageMenu(false))
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