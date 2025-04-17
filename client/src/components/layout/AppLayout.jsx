import React, { Suspense, useCallback, useEffect, useState } from 'react'
import Header from './Header'
import Title from '../../shared/Title'
import { Backdrop, Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/CHatList'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobileMenu} from '../../redux/reducer/misc'
import { useErrors, UseSocket } from '../hook/hooks'
import { getSocket } from '../socket/socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFRETCH_CHATS } from '../event'
import { setNewMessageAlert, setNotificationCount } from '../../redux/reducer/AlertsCount'
import DeleteDialog from '../../shared/DeleteDialog'
import toast from 'react-hot-toast'

const AppLayout = () => (Component) => { 
  return (props) => {
    const navigate = useNavigate() ;
    const dispatch = useDispatch() ;
    const params = useParams() ;
    const {RoomId} = params ;
    
    const [deleteChat , setdeleteChat] = useState({}) ;
    const {user } = useSelector(state => state.auth) ;
    const {isMobileMenu , isDeleteMenu} = useSelector(state => state.misc) ;
   

    const handleMobileClose = () => dispatch(setIsMobileMenu(false))
    
    const socket =  getSocket() ;
    

    const {isLoading , data , isError , error  , refetch} = useMyChatsQuery("")

    useErrors([{isError , error}])
    
    const newNotificationAlertListner  = useCallback((data) => {
      dispatch(setNotificationCount(1))
    } , [])

    const newMessageAlertListner = useCallback((data) => {
      const roomID = data.roomID ;
      
      if(roomID !== RoomId)
      dispatch(setNewMessageAlert({roomID}))
    } , [RoomId])
    
    const RefetchListener = useCallback((data) => {
      console.log('refetch run');
      refetch()
    } , [refetch])
    
    const eventHandlers = { 
      [NEW_REQUEST] : newNotificationAlertListner ,
      [NEW_MESSAGE_ALERT] : newMessageAlertListner ,
      [REFRETCH_CHATS] : RefetchListener ,
    }

    UseSocket(socket , eventHandlers ) 
    
    useEffect(() => {
      if(!RoomId) return ;
      
      if(RoomId && data){
        const  isRoom = data?.data.filter(d => d._id === RoomId)
        if(isRoom.length == 0){
          navigate('/')
        }
      }
    } , [RoomId , data])
      
    const openDeleteChatDialog = (id ,name ,groupChat) => {
      dispatch(setIsDeleteMenu(true))
      setdeleteChat({
        id , groupChat , name
      }) ;
    }
    const handleDeleteChat = () => {
      if(!deleteChat?.name || !deleteChat?.id || !deleteChat?.name ) return toast.error('Some error occured! Please try again or refresh the page.') ;
    }

    return (
      <>
        <Header />
        <Title Title='ChatApp' />

        {isLoading ? <Skeleton/> : (
            <Drawer open={isMobileMenu} onClose={handleMobileClose} >
              <ChatList w='70vw'  chats={data?.data} RoomId={RoomId} handleDeleteChat={openDeleteChatDialog} />
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
            <ChatList chats={data.data} RoomId={RoomId} handleDeleteChat={openDeleteChatDialog} />
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
        <Suspense fallback={<Backdrop open />}>
          <DeleteDialog handleClose={() => dispatch(setIsDeleteMenu(false))} deleteHandler={handleDeleteChat}  openDelete={isDeleteMenu} >
            {
              deleteChat?.groupChat ? 
              <>Do You want to <b>LEAVE <i>{deleteChat?.name}</i> </b>Group?</>
              :
              <>Do you really want to <b>DELETE <i>{deleteChat?.name}</i> Chat</b> ?</>
            }
          </DeleteDialog>
        </Suspense>
      </>
    )
  }
}

export default AppLayout