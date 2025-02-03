import { Add as AddIcon , RemoveCircle } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'

function UserItem({user , handler , UserAdded  ,handlerIsLoading }) {
  const {name , user_id , avatar} = user ;
  console.log(user);
  
  return (
    <ListItem
    sx={{
      ':hover' : {
        bgcolor : 'rgba(0,0,0,0.4)'
      } , 
      transitionDuration : '200ms' , 
    }}>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar/>
        <Typography variant='body1' sx={{flexGrow : 1 , display : 'w'}}>
          {name}
        </Typography>

        <IconButton size='small' sx={{bgcolor : 'primary.main' , color :'white' , 
          ":hover" : {
            bgcolor : 'primary.dark'
          }
        }}
        onClick={() => handler(user_id)} disabled={handlerIsLoading}
        >
          {UserAdded ? <RemoveCircle /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  )
}

export default memo( UserItem)