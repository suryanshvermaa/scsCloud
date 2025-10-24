import { Outlet } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <SiteLayout>
      <Outlet/>
      <Chatbot/>
    </SiteLayout>
  )
}

export default App
