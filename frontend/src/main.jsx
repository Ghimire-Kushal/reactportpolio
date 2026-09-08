import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

// Mount the application once the browser entry point is ready.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <HeroUIProvider>
          <ThemeProvider>
            <App />
            <Toaster position="top-right" />
          </ThemeProvider>
        </HeroUIProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
