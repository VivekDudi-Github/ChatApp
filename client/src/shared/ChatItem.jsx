import { Box, Stack, Typography } from '@mui/material'
import { StyledLink } from '../components/styles/StylesComponent'
import { memo } from 'react'
import AvatarCard from './AvatarCard'

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
    <StyledLink to={`/chat/${_id}`}
    sx={{
      padding : '0rem'
    }}
    onContextMenu={(e) => handleDeleteChatOpen(e._id, groupChat)}>
      <div style={{
        display : 'flex' , 
        gap : '1rem' , 
        alignItems : 'center' , 
        padding : '1rem' ,
        transitionDuration : '500ms' ,
        color : sameSender ? 'white' : 'unset' , 
        background : sameSender ? 'linear-gradient( to right , rgba(200,50,150,9) , rgba(0,0,0,0.4))' : 'unset' ,
        position : 'relative' , 
        justifyContent : 'space-around'
      }}>

      <AvatarCard avatar={avatar} />

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