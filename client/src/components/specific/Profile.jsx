import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'

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

      <ProfileCard heading={'bio'} text={'abx'} />
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