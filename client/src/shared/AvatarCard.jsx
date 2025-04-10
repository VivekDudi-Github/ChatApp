import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'

function AvatarCard({avatar = [] , max = 4}) {
  return (
    <Stack direction={'row'} spacing={0.5}>
      <AvatarGroup open max={max} sx={{position : 'relative'}} >
        <Box height={'3rem'} width={'50px'}>
          {avatar && avatar.map((item , index) =>  
            <Avatar 
              open
              key={index}
              src={item}
              alt='no_img'
              sx={{
                width : '2.75rem'  ,
                height : '2.75rem' , 
                position : 'absolute' , 
                left : {
                  xs : `${0.5 + index}rem` ,
                  sm :`${index}rem`
                }
              }}
            />
          )}
        </Box>
      </AvatarGroup>
    </Stack>
  )
}

export default AvatarCard