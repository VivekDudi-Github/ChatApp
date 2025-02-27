import { lazy } from "react"
import { Navigate, Route ,Routes } from "react-router-dom"
import { Suspense  , useEffect} from "react"
import { LayoutLoader } from "./components/layout/Loaders"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "./redux/reducer/auth"
import toast, {Toaster} from 'react-hot-toast'

const Home = lazy(() => import('./pages/Home') )
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))
const NotFound = lazy(() => import('./pages/NotFound'))
const DashBoard = lazy(() => import('./pages/admin/DashBoard'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const GroupManagement = lazy(() => import('./pages/admin/GroupManagement'))
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'))


function App() {
  const dispatch = useDispatch() ;
  const {user , loader} = useSelector(state => state.auth)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axios.get('/api/v1/user/check-health')
        toast.success('Logged In successfully')
        dispatch(setUser(data.data))
      } catch (error) {
        dispatch(setUser(null))
        console.log(error);
        toast.error(error.response.data.error)
      } 
    }
    fetchUser()
  }, [])
  
  return loader ? 
  <LayoutLoader />
  :
  (
    <>
      <Suspense fallback= {<LayoutLoader/>} >
        <Routes>    
          <Route path="/" element={user ? <Home/> : <Navigate to={'/login'} />} />
          <Route path="/login" element={user ? <Navigate to={'/'} />  : <Login/>} />
          <Route path="/chat/:id" element={user ? <Chat/> : <Navigate to={'/login'} />}/>
          <Route path="/groups" element={user ? <Group/> : <Navigate to={'/login'} />} />
          
          <Route path="*" element={<NotFound/>} />

          <Route path="/admin" element={<AdminLogin/>} />
          <Route path="admin/dashboard" element={<DashBoard />} />
          <Route path='/admin/user-management' element={<UserManagement/>} />
          <Route path='/admin/Group-management' element={<GroupManagement/>} />
          <Route path='/admin/messages-management' element={<MessageManagement/>} />
          
        
        </Routes>  
      </Suspense>
      <Toaster  position="bottom-center"/>
    </>
  )
}

export default App
