import React, { useState } from 'react'

import { Grid ,Box, IconButton, Drawer, Stack, Typography} from "@mui/material";
import {Dashboard as DashBoardIcon , Groups as GroupsIcon , Message as MessageIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Logout as LogoutIcon} from "@mui/icons-material";

import {StyledLink} from '../styles/StylesComponent'
import { Link, useLocation} from "react-router-dom";

function AdminLayout( {children}) {
const [isMobile , setIsMobile] = useState(false) ;


  return (
    <Grid container minHeight={'100vh'} >
      <Box sx={{display : {xs : 'block' , md : 'none'} , position : 'fixed' , right : '1rem' , top : '1rem'}}>
        <IconButton onClick={() => setIsMobile(prev => !prev)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Grid item md={4} lg={2.75}sx={{display : { xs : 'none' , md: 'block'}}}>
        <SideBar />
      </Grid>
      
      <Grid item xs={12} md={8} lg={9.25} sx={{bgcolor : '#f5f5f5'}}>
        {children}
      </Grid>


      <Drawer open={isMobile} onClose={() => setIsMobile(prev => !prev)}>
        <SideBar w='50vw' />
      </Drawer>
    </Grid>
  )
}

const SideBar = ({w='100%'}) => {
  const location = useLocation() ;
  
  return (
    <Stack width={w} direction={'column'} p='1rem' spacing={'3rem'}>
      <Typography variant='h6' textTransform={'uppercase'}>
        Admin
      </Typography>

      <Stack sx={{padding: '1rem 0'  , gap : '0.5rem' }}>
        {AdminTabs.map((t) => (
          <StyledLink to={t.path} key={t.path} >
            <Stack gap={'1rem'} direction={'row'} alignItems={'center'} 
            sx={{ ':hover' : {bgcolor : '#ccc' , color : 'black'} ,
             transitionDuration : '200ms' ,
             p:'1rem' ,
            borderRadius : '50px' ,
            bgcolor : location.pathname === t.path ? 'black' : 'white' ,
            color : location.pathname === t.path ? 'white' : 'black' ,
            }}
            >
              {t.icon}

              <Typography>{t.name}</Typography>
            </Stack>
          </StyledLink>
        ))}

        <Link to={'/login'} onClick={() => {console.log('logiot');
        }} >  
          <Stack gap={'1rem'} direction={'row'} alignItems={'center'} 
              sx={{ ':hover' : {bgcolor : '#ccc' , color : 'black'} ,
              transitionDuration : '200ms' ,
              p:'1rem' ,
              borderRadius : '50px' ,
              }}
          >
            <LogoutIcon/>
            <Typography>Logout</Typography>
          </Stack>

        </Link>
      </Stack>
    </Stack>
  )
}

export default AdminLayout


const AdminTabs = [
  {
    name : 'Dashboard' , 
    path : '/admin/dashboard' , 
    icon : <DashBoardIcon />
  } ,
  {
    name : 'Users' , 
    path : '/admin/user-management' , 
    icon : <ManageAccountsIcon />
  } ,
  {
    name : 'Groups' , 
    path : '/admin/Group-management' , 
    icon : <GroupsIcon />
  } , 
  {
    name : 'Messages' , 
    path : '/admin/messages-management' , 
    icon : <MessageIcon />
  }
]