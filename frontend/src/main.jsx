import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f3',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1a1a1a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1a1a1a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
