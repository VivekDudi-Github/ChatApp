import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { 
  AlternateEmail as EmailIcon , 
  Face2 as FaceIcon , 
  CalendarMonth 
 } from "@mui/icons-material";

import moment from 'moment'

function Profile() {
  return (
    <Stack spacing={'2rem'} direction={'column'} alignItems={'center'}>
      <Avatar
      sx={{
        width : 200 , 
        height : 200 , 
        objectFit :'contain' , 
        border: '5px solid white'
      }} />

      <ProfileCard heading={'Bio'} text={'Mera naam Ajwan sing h'}  />
      <ProfileCard heading={'Usernmae'} text={'miAjwan_sing'} Icon={<EmailIcon />} />
      <ProfileCard heading={'Name'} text={'Ajwan Sing'} Icon={<FaceIcon />} />
      <ProfileCard heading={'Joined'} text={moment('2-12-2024').fromNow()} Icon={<CalendarMonth />} />
    </Stack>
  )
}

export default Profile

const ProfileCard = ({text , Icon , heading}) => {
  return (
    <Stack 
    direction={'row'}
    alignItems={'center'}
    color={'white'}
    textAlign={'center'} 
    >
      {Icon && Icon }
      <Stack >
        <Typography variant='body1'>{text}</Typography>
        <Typography variant='caption' color='gray'>
          {heading}
        </Typography>
      </Stack>
    </Stack>
  )
}