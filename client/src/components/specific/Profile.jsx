import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { 
  AlternateEmail as EmailIcon , 
  Face2 as FaceIcon , 
  CalendarMonth 
 } from "@mui/icons-material";

import moment from 'moment'
import { useSelector } from 'react-redux';

function Profile() {
  const {user , loader} = useSelector(state => state.auth)
  
  return loader ? 
    <Stack spacing={'2rem'} direction={'column'} alignItems={'center'}>
      <Avatar
      sx={{
        width : 200 , 
        height : 200 , 
        objectFit :'contain' , 
        border: '5px solid white'
      }} />

      <ProfileCard heading={'Loading..'}  /> 
    </Stack>
      :
    <Stack spacing={'2rem'} direction={'column'} alignItems={'center'}>
      <Avatar src={user?.avatar?.url ?  user.avatar.url : user.avatar}
      sx={{
        width : 200 , 
        height : 200 , 
        objectFit :'contain' , 
        border: '5px solid white'
      }} />

      <ProfileCard heading={'Bio'} text={user.bio || ''}  />
      <ProfileCard heading={'Usernmae'} text={user.username} Icon={<EmailIcon />} />
      <ProfileCard heading={'Name'} text={user.name} Icon={<FaceIcon />} />
      <ProfileCard heading={'Joined'} text={moment(user.createdAt).fromNow()} Icon={<CalendarMonth />} /> 
    </Stack>
    
}

export default Profile

const ProfileCard = ({text , Icon , heading , loader}) => {
  return (
    <Stack 
    direction={'row'}
    alignItems={'center'}
    color={'white'}
    textAlign={'center'} 
    >
      {Icon && Icon }
      <Stack >
        <Typography variant='body2'>{text}</Typography>
        <Typography variant='caption' color='gray'>
          {heading}
        </Typography>
      </Stack>
    </Stack>
  )
}

