import { lazy } from "react"
import { Navigate, Route ,Routes } from "react-router-dom"
import { Suspense } from "react"
import { LayoutLoader } from "./components/layout/Loaders"

const Home = lazy(() => import('./pages/Home') )
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  let user = true ;
  return (
    <>
      <Suspense fallback= {<LayoutLoader/>} >
        <Routes>    
          <Route path="/" element={user ? <Home/> : <Navigate to={'/login'} />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/chat/:id" element={user ? <Chat/> : <Navigate to={'/login'} />}/>
          <Route path="/groups" element={user ? <Group/> : <Navigate to={'/login'} />} />
          
          <Route path="*" element={<NotFound/>} />
        </Routes>  
      </Suspense>
    </>
  )
}

export default App
