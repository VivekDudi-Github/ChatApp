import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../../shared/ChatItem'

function ChatList({w = '100%' ,
  chats=[] , 
  userId  , 
  onlineUsers = [] , 
  newMessagesAlert = [{userId : '3' , count : 5}] ,
  handleDeleteChat ,
}) {
return (
  <Stack  width={w} direction={'column'} overflow={'auto'} height={'100%'}>
    {chats?.map((data , index)=> {
      const { avatar , user_id , name , groupChat , members} =  data ;
      
      const newMessages = newMessagesAlert.find(({userId}) => userId === user_id) ;

      const IsOnline = members?.some((member) => onlineUsers.includes(user_id)) ;
      
      return (
        <ChatItem  key={index} newMessage={newMessages} name={name} _id={user_id} handleDeleteChatOpen={handleDeleteChat}  isOnline={IsOnline}
          avatar={avatar} sameSender={userId === user_id}
        />
      )
    })}
  </Stack>
)
}

export default ChatList