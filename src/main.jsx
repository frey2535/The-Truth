import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { listenForInstallPrompt, registerServiceWorker } from '@/lib/pwa'

listenForInstallPrompt()
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
