import { Add as AddIcon , RemoveCircle } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'
import AvatarCard from './AvatarCard';

function UserItem({user , styling={} , handler , UserAdded  ,handlerIsLoading }) {
  const {name , _id , avatar} = user ;
  
  return (
    <ListItem
    sx={{
      ':hover' : {
        bgcolor : styling.hover ? 'none' : 'rgba(0,0,0,0.4)'
      } , 
      transitionDuration : '200ms' , 
    }}>
    
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'} {...styling}>
        <AvatarCard avatar={[avatar]}/>
        <Typography variant='body1' sx={{flexGrow : 1 , display : 'w'}}>
          {name}
        </Typography>

        <IconButton size='small' sx={{bgcolor : 'primary.main' , color :'white' , 
          ":hover" : {
            bgcolor : 'primary.dark'
          }
        }}
        onClick={() => handler(_id)} disabled={handlerIsLoading}
        >
          {UserAdded ? <RemoveCircle /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  )
}

export default memo( UserItem)