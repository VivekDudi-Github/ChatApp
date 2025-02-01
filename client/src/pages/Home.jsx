import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import Title from '../shared/Title'
import { Box, Typography } from '@mui/material'

function Home() {
  return (
    <Box sx={{
      background : 'linear-gradient(to top , rgba( 0,0,0 , 0.2) , #fff )'
    }} height={'100%'}>
      <Typography p={'2rem'}  variant='h6'  textAlign={'center'}>Select a friend to chat</Typography>
    </Box>
  )
}

export default AppLayout()(Home)