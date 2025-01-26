import React, { useState } from 'react'
import {Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography} from '@mui/material'

import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StylesComponent';

function Login() {
  const [IsLogin , setIslogin] = useState(true) ;
  const toggleLogin = () => {setIslogin(!IsLogin)} 
  
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setbio] = useState('')
  const [avatar , setAvatar] = useState(null)
  
  const UsernameRegex = /^[a-zA-Z0-9_]{3,15}$/ ;

  const onSubmitSignUp = () => {

  }
  const onSubmitLogin = () => {
    
  }

  return (
    <Container component={'main'} maxWidth='xs' 
    sx={{
        height : '100vh' ,
        display : 'flex' , 
        justifyContent : 'center' , 
        alignItems : 'center' 
    }}
    >
        <Paper elevation={3} 
        sx={{
            padding : 3 ,
            display : 'flex' ,
            flexDirection : 'column' ,
            alignItems : 'center'
            }}
        >
        {IsLogin ? 
            <>
            <Typography variant='h5'>Login</Typography>
            <form onSubmit={onSubmitLogin}>
                <TextField required fullWidth margin='normal' variant='outlined' label='Username' type ={'text'} value={username} onChange={e => setUsername(e.target.value)} />
                {username.length >0 &&
                !UsernameRegex.test(username) && 
                <Typography color='error' variant='caption'>Username should only contain Number, letter & underscore within 3-15 limit. </Typography>
                }
                <TextField required fullWidth margin='normal' variant='outlined' label='Password' type ={'password'} value={password} onChange={e => setPassword(e.target.value)}/>
                {password.length < 8  && 
                <Typography color='error' variant='caption'>Password length should be atleast .8</Typography>
                }
                <Button variant='contained' fullWidth color='primary' type='submit' sx={{marginTop : '1rem'}}> 
                    Login
                 </Button>
                <Typography textAlign={'center'} margin={1}>Or</Typography>
                <Button variant='text' fullWidth onClick={toggleLogin}>
                    SignUp 
                </Button>
            </form>
            </> 
        :
        <>
        <Typography variant='h5'>Sign Up</Typography>
            <form onSubmit={onSubmitSignUp}>

                <Stack position={'relative'} width={'10rem'} margin={'auto'} >
                    <Avatar sx={{
                        width : '10rem' ,
                        height : '10rem' , 
                        objectFit : 'contain'
                    }} 
                    src={avatar ? URL.createObjectURL(avatar) : ''}
                    />

                    <IconButton 
                    component='label'
                    sx={{
                        position : 'absolute' ,
                        bottom : '0' , 
                        right : '0' , 
                        color : 'white' , 
                        backgroundColor : 'rgba(0,0,0,0.5)' , 
                        ":hover" : {
                            bgcolor :'rgba(0,0,0,0.7)'
                        }
                    }}
                    >
                        <>
                            <CameraAlt />
                            <VisuallyHiddenInput onChange={(e) => setAvatar(e.target.files[0])}  type='file' />
                        </>
                    </IconButton>
                </Stack>

                <TextField required fullWidth margin='normal' variant='outlined' value={email} label='Email' type ='email' onChange={(e) => setEmail(e.target.value)}/>
                <TextField required fullWidth margin='normal' variant='outlined' value={username} label='Username' type ='text' onChange={(e) => setUsername(e.target.value)}/>
                    {username.length >0 &&
                    !UsernameRegex.test(username) && 
                    <Typography color='error' variant='caption'>Username should only contain Number, letter & underscore within 3-15 limit. </Typography>
                    }
                <TextField required fullWidth margin='normal' variant='outlined' value={password} label='Password' type ='password'onChange={(e) => setPassword(e.target.value)}/>
                    {password.length < 8  && 
                    <Typography color='error' variant='caption'>Password length should be atleast .8</Typography>
                    }
                <TextField required fullWidth margin='normal' variant='outlined' value={bio} label='Bio' type ='text' onChange={(e) => setbio(e.target.value)}/>
                <Button variant='contained' fullWidth color='primary' type='submit' sx={{marginTop : '1rem'}}> 
                    Sign Up
                </Button>
                <Typography textAlign={'center'} margin={1}>Or</Typography>
                <Button variant='text' fullWidth onClick={toggleLogin}>
                    Login 
                </Button>
            </form>
        </>    
    
    }
        </Paper>
    </Container>
  )
}

export default Login