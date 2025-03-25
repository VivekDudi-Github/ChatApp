import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../../shared/ChatItem'
import { useSelector } from 'react-redux'

function ChatList({w = '100%' ,
  chats=[] , 
  RoomId  , 
  onlineUsers = [] , 
  newMessagesAlert = [{_id : '3' , count : 5}] ,
  handleDeleteChat ,
}) {

return (
  <Stack  width={w} direction={'column'} overflow={'auto'} height={'100%'}>
    {chats?.map((data , index)=> {
      const { avatar , _id , name , groupChat , members} =  data ;
    
      const newMessages = newMessagesAlert.find(({_id}) => _id === _id) ;

      const IsOnline = members?.some((member) => onlineUsers.includes(_id)) ;

      return (
        <ChatItem  key={index} newMessage={newMessages} name={ name} _id={_id} handleDeleteChatOpen={handleDeleteChat}  isOnline={IsOnline}
          avatar={[avatar]} sameSender={RoomId === _id}
        />
      )
    })}
  </Stack>
)
}

export default ChatList