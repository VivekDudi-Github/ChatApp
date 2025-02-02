import React, { useState } from 'react'
import {Drawer, Grid, IconButton, Stack, Tooltip, Typography} from '@mui/material'
import {KeyboardBackspaceOutlined, Menu as MenuIcon} from '@mui/icons-material'
import {useNavigate, useSearchParams} from 'react-router-dom'
import { memo } from 'react';
import { StyledLink } from '../components/styles/StylesComponent';
import AvatarCard from '../shared/AvatarCard'
import { sampleGroup } from '../shared/data';

function Group() {
const navigate = useNavigate() ;
const CurrentGroup_id = useSearchParams()[0].get('group')


const [isMobileOpen, setisMobileOpen] = useState(false) ;


const handleMobile = () => {
  setisMobileOpen(prev => !prev)
} 

const iconBtns = (
  <>
  <IconButton
  onClick={handleMobile} 
  sx={{
    display : {
      xs : 'block' ,
      sm : 'none' ,
      right : '1rem' ,
      top : '1rem' ,
      position : 'absolute' ,
    }
  }}>

    <MenuIcon />
  </IconButton>
    <Tooltip title='black'>
      <IconButton
      sx={{
        position : 'absolute' , 
        top : '1rem' , 
        left : '1rem' ,
        color : 'rgb(200,200,200)' , 
        bgcolor : 'black' , 
        ":hover" : {
          bgcolor : 'black'
        }
      }}
      onClick={() => navigate('/')}
      >
        <KeyboardBackspaceOutlined />
      </IconButton>
    </Tooltip>
  </>)
  return (
    <Grid container height={'100vh'}>
      <Grid item 
      sx={{
        display : {
          xs : 'none' , 
          sm : 'block'
        }  
      }}
      sm={4}
      >
        <GroupList myGroup={sampleGroup} CurrentGroup_id={CurrentGroup_id} />
      </Grid>

      <Grid item 
      xs={12} 
      sm={8}
      sx={{
        display : 'flex' , 
        flexDirection : 'column' ,
        position : 'relative' , 
        padding : ' 1rem 3rem' , 
        alignItems : 'center'
      }}
      >
        {iconBtns}
      </Grid>

      <Drawer 
      sx={{
        display : {
          xs : 'block' , 
          sm : 'none'
        }
      }} open={isMobileOpen} onClose={() => setisMobileOpen(false)}>
      <GroupList w={'50vw'} myGroup={sampleGroup} CurrentGroup_id={CurrentGroup_id} />
      </Drawer>
    </Grid>
  )
}

const GroupList = ({w='100%' , myGroup = [] , CurrentGroup_id}) => {
  return <Stack width={w}>
    {myGroup.length > 0 ? 
    myGroup.map((g , index) => <GeoupListItems group={g} CurrentGroup_id={CurrentGroup_id} key={index}/> )
    : 
    <Typography p={'1rem'} textAlign={'center'}>No Group</Typography>
    }
  </Stack>
}

const GeoupListItems =memo (({group , CurrentGroup_id}) => {
  const {name , avatar , _id} = group ;

  return (
  <StyledLink to={`?groups=${_id}`} onClick={e => {if(CurrentGroup_id ===_id)  e.preventDefault()}  }>
    <Stack 
    sx={{
      ":hover":{
        bgcolor : 'rgba(0,0,0,0.4)'
      } ,
      transitionDuration : '200ms' ,
    }} 
    direction={'row'} 
    spacing={'1rem'} alignItems={'center'}>
      <AvatarCard avatar={[avatar]}/>
      <Typography>{name}</Typography>
    </Stack>
  </StyledLink>)
})



export default Group