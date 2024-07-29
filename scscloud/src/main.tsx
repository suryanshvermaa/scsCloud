import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router } from './routes/routes.tsx'
import { RouterProvider } from 'react-router-dom'




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
