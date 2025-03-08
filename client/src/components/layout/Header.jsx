import React, { lazy, Suspense, useState  } from 'react'
import {useNavigate} from 'react-router-dom'
import {AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography} from '@mui/material'
import {Add as AddIcon , Logout as LogoutIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Notifications} from '@mui/icons-material'
import { setUser } from '../../redux/reducer/auth'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios' ;
import Toast from 'react-hot-toast'
import { setIsMobileMenu, setIsNotitficationMenu, setIsSearchOpen } from '../../redux/reducer/misc'

const SearchDiallog = lazy(() => import('../specific/Search'))
const NotificationDialog =  lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

function Header() {
  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;

  const {isMobileMenu , isSearchOpen , isNotificationMenu } = useSelector(state => state.misc) ;
  const [IsNotificationDialog ,setIsNotificationDialog] = useState(false) ;
  const [IsNewGroupDialog , setIsNewGroupDialog] = useState(false) ;

  

  const handleMobile = () => {dispatch(setIsMobileMenu(true))} ;
  const openNewGroup = () => { setIsNewGroupDialog( prev => !prev)} ;
  const openSearchDialog = () => {dispatch(setIsSearchOpen(true))} ;
  const NavigateToGroup = () => { navigate('/groups')} ;
  const OpenNotification = () => { dispatch(setIsNotitficationMenu(true))} ;
  const LogoutHandler = async() => {
    try {
      const data = await axios.get('/api/v1/user/logout' , {
        withCredentials : true 
      })
      console.log(data.data)
      dispatch(setUser(null))
      navigate('/login')
      Toast.success('Logged Out successfully')
    } catch (error) {
      console.log(error);
      
      Toast.error("Something went wrong, Please try again.")
    }
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

    {isSearchOpen && (
      <Suspense fallback={<Backdrop  open/>}>
        <SearchDiallog />
      </Suspense>
    )}
    {IsNewGroupDialog && (
      <Suspense fallback={<Backdrop  open/>}>
        <NewGroupDialog />
      </Suspense>
    )}
    {isNotificationMenu && (
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