import React from "react";

const HostingServiceDoc:React.FC=()=>{
    return (
        <>
         <h1 className="text-3xl font-semibold text-gray-700 text-start mt-5">2) Static Website Hosting</h1>
       <div className="paragraph ">
          <p className="md:ml-6 ml-1">Static web Hosting is a service which provides developers to host their static react or vite-react websites.Please read full doc to successful host your website with zero errors </p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">diagram</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`React/Vite App → Build → Static Files (HTML, CSS, JS)
                                    ↓
                            Upload to SCS Hosting
                                    ↓
                        ┌───────────┴───────────┐
                        ↓                       ↓
                    CDN Delivery          Fast Loading
                        ↓                       ↓
                    Your Users  ←───────────────┘`}
              </code>
            </pre>
          </div>
          <p>There are some steps to use this service. Follow the doc:-</p>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">a) Vite React Website</h1>
          <p className="md:ml-6 ml-1">Add <b>base:  '. /'</b> in <b>vite.config.ts </b> or <b>vite.config.js</b></p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">typescript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Add this line for proper routing
})`}
              </code>
            </pre>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">b) Create react app</h1>
          <p className="md:ml-6 ml-1">Add <b>homepage : '. /'</b> in <b>package.json</b></p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">json</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`{
  "name": "my-react-app",
  "version": "0.1.0",
  "homepage": "./",  // Add this line for proper routing
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`}
              </code>
            </pre>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">* If you are using react router dom</h1>
          <p className="md:ml-6 ml-1"> If you are using react-router-dom then map <b>* route</b> to <b>login</b> component or <b>register</b> or <b>home</b> component</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">jsx</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Catch all route - redirect to login or home */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`}
              </code>
            </pre>
          </div>
          

       </div>
        </>
    )
}
export default HostingServiceDoc;