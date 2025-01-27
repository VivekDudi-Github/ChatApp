import { Box, Stack, Typography } from '@mui/material'
import { StyledLink } from '../components/styles/StylesComponent'
import { memo } from 'react'

function ChatItem({
  avatar = [] ,
  name = '' , 
  _id ,
  groupChat = false ,
  sameSender , 
  isOnline , 
  newMessage , 
  handleDeleteChatOpen
}){
  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChatOpen(e._id, groupChat)}>
      <div style={{
        display : 'flex' , 
        gap : '1rem' , 
        alignItems : 'center' , 
        padding : '1rem' ,
        color : sameSender ? 'white' : 'unset' , 
        backgroundColor : sameSender ? 'black' : 'unset' ,
        position : 'relative'
      }}>

        <Stack>
          <Typography>{name}</Typography>
          {
            newMessage && (
              <Typography>
                {newMessage.count} New Messages
              </Typography>
            )
          }
        </Stack>

        {
          isOnline && (
            <Box sx={{
              width : '10px' ,
              height : '10px' , 
              borderRadius : '50%' ,
              backgroundColor : 'green'  , 
              top : '50%' ,
              right : '1rem' ,
              transform : 'translateY(-50)'
            }} />
          )
        }
      </div>
    </StyledLink>
  )
}

export default memo(ChatItem)