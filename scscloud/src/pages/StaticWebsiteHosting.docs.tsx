import React from "react";
import HostingServiceDoc from "../docs/HostingServiceDoc";
import DocsLayout from "../components/docs/DocsLayout";

const StaticWebsiteHosting:React.FC=()=>{
   return (
     <DocsLayout title="Static Website Hosting">
        <HostingServiceDoc/>
     </DocsLayout>
   )
}

export default StaticWebsiteHosting;