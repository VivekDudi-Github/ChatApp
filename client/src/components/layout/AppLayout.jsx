import React from 'react'
import Header from './Header'
import Title from '../../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/CHatList'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobileMenu} from '../../redux/reducer/misc'
import { useErrors } from '../hook/hooks'
import { getSocket } from '../socket/socket'

const AppLayout = () => (Component) => { 
  return (props) => {
    const dispatch = useDispatch() ;
    const params = useParams() ;
    const {RoomId} = params ;
    
    const {user } = useSelector(state => state.auth) ;
    const {isMobileMenu} = useSelector(state => state.misc) ;

    const handleMobileClose = () => dispatch(setIsMobileMenu(false))
    const handleMobileOpen = () => dispatch(setIsMobileMenu(true))
        
    const socket =  getSocket() ;
    

    const {isLoading , data , isError , error  , refetch} = useMyChatsQuery("")

    useErrors([{isError , error}])
    

    return (
      <>
        <Header />
        <Title Title='ChatApp' />

        {isLoading ? <Skeleton/> : (
            <Drawer open={isMobileMenu} onClose={handleMobileClose} >
              <ChatList w='70vw'  chats={data?.data} RoomId={RoomId} handleDeleteChat={() => console.log('chat deleted')} />
            </Drawer>
          ) 
        }

        <Grid  container height={"calc(100vh - 4rem)"}>
        
          <Grid item sm={4} md={3}  
            sx={{
            display : { xs :'none' , sm : 'block'}
            }} 
            height={'100%'}
          >  
            {isLoading ? <Skeleton /> : 
            <ChatList chats={data.data} RoomId={RoomId} handleDeleteChat={() => console.log('chat deleted')} />
            }
          </Grid>

          <Grid item xs={12}  sm={8} md={5} lg={6} height={'100%'} >
            <Component room={RoomId} {...props} />
          </Grid>

          <Grid item md={4} lg={3} height={'100%'} 
            sx={{
              display : {xs :'none' , md : 'block'} ,
              padding : '2rem' ,
              bgcolor : 'rgb(0,0,0,0.8)'
            }}>
            <Profile />
          </Grid>
        </Grid>
      </>
    )
  }
}

export default AppLayout