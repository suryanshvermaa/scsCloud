import React from "react";
import HostingServiceImage from '../assets/hostingService.png';
import ViteConfigImage from '../assets/viteConfig.png';
import ReactRouterImage from '../assets/BrowserRouter.png';
import ReactAppImage from '../assets/CRA.png';

const HostingServiceDoc:React.FC=()=>{
    return (
        <>
         <h1 className="text-3xl font-semibold text-gray-700 text-start mt-5">2) Static Website Hosting</h1>
       <div className="paragraph ">
          <p className="md:ml-6 ml-1">Static web Hosting is a service which provides developers to host their static react or vite-react websites.Please read full doc to successful host your website with zero errors </p>
          <div className='rounded shadow shadow-gray-600 p-3 my-4'>
          <img src={HostingServiceImage} alt="hostingServiceImage" className="my-6"/>
          </div>
          <p>There are some steps to use this service. Follow the doc:-</p>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">a) Vite React Website</h1>
          <p className="md:ml-6 ml-1">Add <b>base:  '. /'</b> in <b>vite.config.ts </b> or <b>vite.config.js</b></p>
          <div className='rounded shadow shadow-gray-600 p-3 my-4'>
          <img src={ViteConfigImage} alt="viteConfigImage" className="my-6"/>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">b) Create react app</h1>
          <p className="md:ml-6 ml-1">Add <b>homepage : '. /'</b> in <b>package.json</b></p>
          <div className='rounded shadow shadow-gray-600 p-3 my-4'>
          <img src={ReactAppImage} alt="reactappcongigurationImage" className="my-6"/>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">* If you are using react router dom</h1>
          <p className="md:ml-6 ml-1"> If you are using react-router-dom then map <b>* route</b> to <b>login</b> component or <b>register</b> or <b>home</b> component</p>
          <div className='rounded shadow shadow-gray-600 p-3 my-4'>
          <img src={ReactRouterImage} alt="reactroutesImage" className="my-6"/>
          </div>
          

       </div>
        </>
    )
}
export default HostingServiceDoc;