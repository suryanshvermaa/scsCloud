import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HostingServiceDoc from "../docs/HostingServiceDoc";

const StaticWebsiteHosting:React.FC=()=>{
   return (
    <>
    <Header/>
       <div className="h-[45px]"></div>
       <div className="flex justify-center">
         <div className="md:w-[94%] w-full rounded shadow shadow-gray-600 m-3 md:p-4 p-0">
         <HostingServiceDoc/>
         </div>
         </div>
    <Footer/>
    </>
   )
}

export default StaticWebsiteHosting;