import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { sampleNotification } from '../../shared/data';
import { useErrors } from '../hook/hooks';
import { useGetNotificationQuery } from '../../redux/api/api';

const Notifications = () => {

  const {isLoading, data , error , isError} =  useGetNotificationQuery() ;
  useErrors([{error , isError}])

  const FreindRequestHandler = (_id , accept) => {}
  
  return (
    <Dialog open>
      <Stack p={{ xs : '1rem' , sm : '2rem'}} maxWidth={'25rem'}>
        <DialogTitle>
          Notifications
        </DialogTitle>
          {!sampleNotification.length > 0 ? 
          <Typography>No Notifications</Typography> 
          :
          sampleNotification.map((e , i ) => {
            return (
              <NotificationItem key={e.user_id}  sender={e.sender} user_id={e.user_id} handler={FreindRequestHandler}/>
            )
          })}
      </Stack>
    </Dialog>
  )
}
const NotificationItem = ({sender , user_id} , handler) => {
  return (
    <>
      <ListItem
        sx={{
          ':hover' : {
            bgcolor : 'rgba(0,0,0,0.1)'
          } , 
        transitionDuration : '200ms' , 
        }}>
        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
          <Avatar src={sender?.avatar}/>
          <Typography variant='body1'
            sx={{
              flexGrow : 1 ,  
              display : '-webkit-box' , 
              WebkitLineClamp : 1 ,
              overflow : 'hidden' ,
              WebkitBoxOrient : 'vertical' , 
              textOverflow : 'ellipsis' ,
              width : '100%'
            }}
          >{sender.name}</Typography>

          <Stack direction={{
            xs : 'column' ,
          }}>
            <Button onClick={() => handler(user_id , true)}>Accept</Button>
            <Button color='error' onClick={() => handler(user_id , false)}>Refuse</Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  )
}

export default memo(Notifications)