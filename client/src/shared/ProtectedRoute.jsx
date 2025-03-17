import React from 'react'
import { SocketProvider } from '../components/socket/socket'
import { Outlet, useNavigate } from 'react-router-dom'

function ProtectedRouteWrapper({user}) {
  const navigate = useNavigate() ;
  if(!user) navigate('/login')
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  )
}

export default ProtectedRouteWrapper