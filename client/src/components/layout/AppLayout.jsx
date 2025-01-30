import React from 'react'
import Header from './Header'
import Title from '../../shared/Title'
import { Grid } from '@mui/material'
import ChatList from '../specific/CHatList'
import { sampleData } from '../../shared/data'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'

const AppLayout = () => (Component) => { 
  return (props) => {
    const params = useParams() ;
    const {id} = params ;

    return (
      <>
        <Header />
        <Title Title='ChatApp' />

        <Grid  container height={'calc(100vh -4 rem)'} >
        
          <Grid item sm={4} md={3}  
            sx={{
            display : { xs :'none' , sm : 'block'}
            }} 
            height={'100%'}
          >  
            <ChatList chats={sampleData} userId={id} handleDeleteChat={() => console.log('chat deleted')} />
          </Grid>

          <Grid item xs={12}  sm={8} md={5} lg={6} height={'100%'} >
            <Component {...props} />
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