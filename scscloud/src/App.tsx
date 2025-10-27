import { Outlet } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import Chatbot from './components/Chatbot'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <SiteLayout>
      <Outlet/>
      <Chatbot/>
      <Toaster />
    </SiteLayout>
  )
}

export default App
