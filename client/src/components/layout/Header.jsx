import React, { lazy, Suspense, useState  } from 'react'
import {useNavigate} from 'react-router-dom'
import {AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography} from '@mui/material'
import {Add as AddIcon , Logout as LogoutIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Notifications} from '@mui/icons-material'
import { setUser } from '../../redux/reducer/auth'
import { useDispatch } from 'react-redux'

const SearchDiallog = lazy(() => import('../specific/Search'))
const NotificationDialog =  lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

function Header() {
  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;

  const [IsSearch ,setIsSearch] = useState(false) ;
  const [IsNotificationDialog ,setIsNotificationDialog] = useState(false) ;
  const [IsNewGroupDialog , setIsNewGroupDialog] = useState(false) ;

  const handleMobile = () => {}
  const openNewGroup = () => { setIsNewGroupDialog( prev => !prev)}
  const openSearchDialog = () => { setIsSearch(prev => !prev)}
  const NavigateToGroup = () => { navigate('/groups')} 
  const OpenNotification = () => { setIsNotificationDialog( prev => !prev)}
  const LogoutHandler = () => {
    dispatch(setUser(null))
  }

  return (
  <>
    <Box sx={{flexGrow : '1' }} height={'4rem'}>
      
      <AppBar position='static' sx={{bgcolor : '#ea7070'}} >
        
        <Toolbar>
          <Typography variant='h6' sx={{display : { xs : 'none' , sm : 'block'}}} >
            Mail.com
          </Typography>
          
          <Box  sx={{display : { xs : 'block' , sm : 'none'}}} >
            <IconButton color='inherit' onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{flexGrow : 1}} />

          <Box>
            <IconBtn title="Search" onClick={openSearchDialog} Icon={SearchIcon} />
            <IconBtn title="New Group" onClick={openNewGroup} Icon={AddIcon} />
            <IconBtn title="Manage Group" onClick={NavigateToGroup} Icon={GroupIcon} />
            <IconBtn title="Logout" onClick={LogoutHandler} Icon={LogoutIcon} />
            <IconBtn title="Notification" onClick={OpenNotification} Icon={Notifications} />
          </Box> 

        </Toolbar>
      </AppBar>
    </Box>

    {IsSearch && (
      <Suspense fallback={<Backdrop  open/>}>
        <SearchDiallog />
      </Suspense>
    )}
    {IsNewGroupDialog && (
      <Suspense fallback={<Backdrop  open/>}>
        <NewGroupDialog />
      </Suspense>
    )}
    {IsNotificationDialog && (
      <Suspense fallback={<Backdrop  open/>}>
        <NotificationDialog />
      </Suspense>
    )}
  </>
  )
}

const IconBtn = ({ title, onClick, Icon }) => (
  <Tooltip title={title}>
    <IconButton color="inherit" size="large" onClick={onClick}>
      <Icon />
    </IconButton>
  </Tooltip>
);

export default Header