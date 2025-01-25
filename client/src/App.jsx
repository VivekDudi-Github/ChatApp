import { lazy } from "react"
import { Route ,Routes } from "react-router-dom"

const Home = lazy(() => import('./pages/Home') )
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/chat/:id" element={<Chat/>} />
        <Route path="/group" element={<Group/>} />
        
      </Routes>
    </>
  )
}

export default App
