import { Outlet } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'

function App() {
  return (
    <SiteLayout>
      <Outlet/>
    </SiteLayout>
  )
}

export default App
