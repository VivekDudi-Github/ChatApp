import React from 'react'
import { SocketProvider } from '../components/socket/socket'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRouteWrapper({user}) {
  
  
  if(!user) {
   return <Navigate to={'/login'} />
  }else {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  )
  }
}

export default ProtectedRouteWrapper