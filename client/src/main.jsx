import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline} from '@mui/material'
import {HelmetProvider} from 'react-helmet-async'
import {BrowserRouter} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <CssBaseline/>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
  
)
