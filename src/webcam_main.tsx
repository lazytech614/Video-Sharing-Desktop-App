import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {ClerkProvider} from '@clerk/clerk-react'
import Webcam_App from './Webcam_App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY) 
  throw new Error('Missing Publishable Key')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl={"/"}
    >
      <Webcam_App />
    </ClerkProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
