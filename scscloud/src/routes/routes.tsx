import { createBrowserRouter } from 'react-router-dom';
import Register from '../pages/Register.tsx';
import Login from '../pages/Login.tsx';
import Home from '../pages/Home.tsx';
import App from '../App.tsx';
import HLSTranscoderService from '../pages/HLSTranscoderService.tsx';
import AmountScreen from '../pages/AmountScreen.tsx';
import BillingDashboard from '../pages/BillingDashboard.tsx';
import HLSTranscoderDocs from '../pages/HLSTranscoder.docs.tsx';
import Profile from '../pages/Profile.tsx';
import HostingService from '../pages/HostingService.tsx';
import StaticWebsiteHosting from '../pages/StaticWebsiteHosting.docs.tsx';
import Redirect from '../components/Redirect.tsx';
import LandingPage from '../pages/LandingPage.tsx';
import ObjectStorageDashboard from '../pages/ObjectStorageDashboard.tsx';
import ObjectStorageDocs from '../pages/ObjectStorage.docs.tsx';
import Pricing from '../pages/Pricing.tsx';

export const router=createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
            {
                path:'/',
                element:<LandingPage/>
              },
            {
                path:'/register',
                element:<Register/>
              },
              {
                path:'/login',
                element:<Login/>
              },{
                 path:'/profile',
                 element:<Profile/>
              },
              {
                path:'/home',
                element:<Home/>
              },
              {
                  path:"hls-transcoding-service",
                  element:<HLSTranscoderService/>
              },
              {
                path:'amount-dashboard',
                element:<BillingDashboard/>
              },
              {
                path:'amount-dashboard-old',
                element:<AmountScreen/>
              },
              {
                path:'/hls-transcoder-docs',
                element:<HLSTranscoderDocs/>
              },{
                path:'/hosting-service',
                element:<HostingService/>
              },
              {
                path:'/hosting-service-docs',
                element:<StaticWebsiteHosting/>
              },{
                path:'/pricing',
                element:<Pricing/>
              },{
                path:'/object-storage',
                element:<ObjectStorageDashboard/>
              },{
                path:'/object-storage-docs',
                element:<ObjectStorageDocs/>
              },{
                path:'/redirect',
                element:<Redirect/>
              },{
                path:"*",
                element:<LandingPage/>
              }
        ]
    }  
  ])
