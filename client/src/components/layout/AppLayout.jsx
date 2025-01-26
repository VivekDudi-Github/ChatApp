import React from 'react'
import Header from './Header'
import Title from '../../shared/Title'
import { Grid } from '@mui/material'

const AppLayout = () => (Component) => { 
  return (props) => {
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
          one
        </Grid>

        <Grid item xs={12}  sm={8} md={5} lg={6} height={'100%'} >
          <Component {...props} />
        </Grid>
        <Grid item md={4} lg={3} height={'100%'} 
        sx={{
          display : {xs :'none' , md : 'block'} ,
          padding : '2rem' ,
          bgcolor : 'rgb(0,0,0,0.4)'
        }}>
          Second
        </Grid>

        </Grid>
      </>
    )
  }
}

export default AppLayout