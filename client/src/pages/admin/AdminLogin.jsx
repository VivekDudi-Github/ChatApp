import React , {useState} from 'react'
import {Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography} from '@mui/material'
import {Navigate} from 'react-router-dom'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const UsernameRegex = /^[a-zA-Z0-9_]{3,15}$/ ;


  const onSubmitLogin = (e) => {e.preventDefault()}
  const isAdmin = ''
  if(isAdmin){
    return <Navigate to={'/admin/dashboard'} />
  }

  return (
    <Container component={'main'}  
    sx={{
        height : '100vh' ,
        display : 'flex' , 
        justifyContent : 'center' , 
        alignItems : 'center' ,
        background : 'linear-gradient(to top , rgba(0,0,0 ,9) , rgba(0,0,0,0.1))'
    }}
    >
        <Paper elevation={3} 
        sx={{
            maxWidth : '450px' ,
            padding : 3 ,
            display : 'flex' ,
            flexDirection : 'column' ,
            alignItems : 'center'
            }}
        >
        <Typography variant='h5'>Admin Login</Typography>
          <form onSubmit={onSubmitLogin}>
              
              <TextField required fullWidth margin='normal' variant='outlined' label='Password' type ={'password'} value={password} onChange={e => setPassword(e.target.value)}/>
              {password.length < 8  && 
              <Typography color='error' variant='caption'>Password length should be atleast .8</Typography>
              }
              <Button variant='contained' fullWidth color='primary' type='submit' sx={{marginTop : '1rem'}}> 
                  Login
                </Button>
          </form>
        </Paper>
    </Container>
  )
}

export default AdminLogin