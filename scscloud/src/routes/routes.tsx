import { createBrowserRouter } from 'react-router-dom';
import Register from '../pages/Register.tsx';
import Login from '../pages/Login.tsx';
import Home from '../pages/Home.tsx';
import App from '../App.tsx';
import HLSTranscoderService from '../pages/HLSTranscoderService.tsx';
import AmountScreen from '../pages/AmountScreen.tsx';
import HLSTranscoderDocs from '../pages/HLSTranscoder.docs.tsx';
import Profile from '../pages/Profile.tsx';
import HostingService from '../pages/HostingService.tsx';
import StaticWebsiteHosting from '../pages/StaticWebsiteHosting.docs.tsx';
import Redirect from '../components/Redirect.tsx';

export const router=createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
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
                path:'/',
                element:<Redirect/>
              },{
                path:"*",
                element:<Login/>
              }
        ]
    }  
  ])
