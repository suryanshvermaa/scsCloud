import React from "react";
import { FaVideo } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Services:React.FC=()=>{
     const navigate=useNavigate();
    
    return (
        <div className="absolute bg-gray-200 md:w-[60%] p-5 w-full z-40">
            <h1 className="text-xl font-semibold text-gray-800">Services</h1>
    
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-2 cursor-pointer" onClick={()=>navigate('/hls-transcoding-service')}>
                         <FaVideo className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">HLS Transcoder</h3>
                    </div>
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-2 cursor-pointer"onClick={()=>navigate('/hosting-service')}>
                         <IoIosCodeWorking className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">Static Web hosting</h3>
                    </div>
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-2 cursor-pointer">
                         <GrStorage className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">Storage</h3>
                    </div>

               

        </div>
    )
}
export default Services;