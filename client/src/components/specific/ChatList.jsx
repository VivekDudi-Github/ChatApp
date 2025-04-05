import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../../shared/ChatItem'
import { useSelector } from 'react-redux'

function ChatList({w = '100%' ,
  chats=[] , 
  RoomId  , 
  onlineUsers = [] , 
  handleDeleteChat ,
}) {

  
  const {newMessageAlert} = useSelector(state => state.counts) ;

return (

  <Stack  width={w} direction={'column'} overflow={'auto'} height={'100%'}>
    {chats?.map((data , index)=> {
      const { avatar , _id , name , groupChat , members} =  data ;
      
      const newMessages = newMessageAlert.find((alert) => alert.roomID == _id) ;

      const IsOnline = members?.some((member) => onlineUsers.includes(_id)) ;

      return (
        <ChatItem  key={index} newMessage={newMessages} name={ name} _id={_id} handleDeleteChatOpen={handleDeleteChat}  isOnline={IsOnline}
          avatar={ avatar.url ? [avatar.url] : [avatar]  } sameSender={RoomId === _id}
        />
      )
    })}
  </Stack>
)
}

export default ChatList