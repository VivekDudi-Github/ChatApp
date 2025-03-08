import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { useErrors } from '../hook/hooks';
import { useAnswerFriendRequestMutation, useGetNotificationQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotitficationMenu } from "../../redux/reducer/misc";
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch =  useDispatch() ;
  const {isNotificationMenu} = useSelector(state => state.misc)
  const {isLoading, data , error , isError} =  useGetNotificationQuery() ;
  useErrors([{error , isError}])

  const [answerRequest] = useAnswerFriendRequestMutation() ; 

  const FreindRequestHandler = async(_id , response) => {
    try {
      const res  = await answerRequest({id : _id , response})
      if(res?.data?.success == true){
        response =='accepted' ? 
        toast.success('Request Accepted') 
        :
        toast.error('Request Refused')
      }else {
        toast.error(res?.error?.data?.error);
      }

    } catch (error) {
      console.log(error);
      toast.error(error || 'Something went wrong')      
    }
  }
  


  return (
    <Dialog open={isNotificationMenu} onClose={() => dispatch(setIsNotitficationMenu(false))} >
      <Stack p={{ xs : '1rem' , sm : '2rem'}} maxWidth={'25rem'}>
        <DialogTitle>
          Notifications
        </DialogTitle>
          {isLoading ? <Skeleton/> 
          :
          <>
            {!data?.data.length > 0 ? 
              <Typography>No Notifications</Typography> 
              :
              data.data.map((n , i ) => {
                return (
                  <NotificationItem key={n._id}  sender={n.sender} handler={FreindRequestHandler}/>
                )
             })}
          </>
          }
      </Stack>
    </Dialog>
  )
}
const NotificationItem = ({sender , handler }) => {
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
            <Button onClick={() => handler(sender._id , 'accepted')}>Accept</Button>
            <Button color='error' onClick={() => handler(sender._id , 'rejected')}>Refuse</Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  )
}

export default memo(Notifications)