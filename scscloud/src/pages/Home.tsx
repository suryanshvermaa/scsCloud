import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import axios from "axios";
import { FaVideo } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import SCSCloudImage from '../assets/SCSCloud.png';
import HLSTranscoder from "../docs/HLSTranscoder";
import HostingServiceDoc from "../docs/HostingServiceDoc";

const Home:React.FC=()=>{
  const navigate=useNavigate();
  useEffect(()=>{

      async function validator(){
        const accessToken= Cookies.get("AccessCookie");
        if(!accessToken){
           const refreshToken= Cookies.get("RefreshCookie");
           if(refreshToken){
            const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/refresh-token`,{refreshToken});
            if(res){
              const date1=new Date();
        date1.setHours(date1.getHours()+1)
        const date2=new Date();
        date2.setHours(date2.getHours()+12);
                Cookies.set("AccessCookie", res.data.cookies[0].value, {expires:date1})
                Cookies.set("RefreshCookie", res.data.cookies[1].value, {expires:date2})
                console.log('refresh token successfully');
                
            }else{
                console.log('err in refresh token');
                navigate('/login');
            }
           }else{
            
            navigate('/login');
           }
        
    }
      
    }
    validator();
  },[])
  return (
    
    <>
    <Header />
    <div className="h-[45px]">
    </div>
    <div className="w-full flex flex-row">
      <div className="leftDiv md:w-[20%] md:flex md:flex-col hidden bg-blue-100 h-[83vh] rounde-md shadow-md shadow-gray-400 my-5 ml-4 rounded-md p-4 fixed" >
                   <h1 className="text-2xl font-semibold text-gray-900 p-2 ">Services </h1>
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-1 cursor-pointer" onClick={()=>navigate('/hls-transcoding-service')}>
                         <FaVideo className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">HLS Transcoder</h3>
                    </div>
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-1 cursor-pointer" onClick={()=>navigate('/hosting-service')}>
                         <IoIosCodeWorking className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">Static Web hosting</h3>
                    </div>
                    <div  className="p-3 border-solid border-b-2 border-gray-300 flex flex-row items-center mt-1 cursor-pointer">
                         <GrStorage className="text-2xl text-blue-400  font-extralight" />
                         <h3 className="text-md font-semibold text-gray-700 pl-3">Storage</h3>
                    </div>
      </div>
      <div className="rightDiv w-full md:ml-[20.3%] p-6 ml:0">
   
       <div className="w-full rounded-md p-5 flex-1 flex flex-col items-center shadow shadow-gray-700 ">
       <div className="md:w-[70%] w-full flex flex-col p-4 bg-white rounded-md shadow shadow-gray-700 ">
            <img src={SCSCloudImage} alt="scscloudImage" />
            <div className="bg-gray-600 rounded-md p-3">
              <h1 className="text-center text-2xl font-bold text-gray-200">What is SCS?</h1>
              <h1 className="text-center text-2xl font-bold text-gray-200">(Suryansh Cloud Services)</h1>
            </div>
       </div>
       <div className=" flex flex-col bg-white w-full mt-5">
           
       <h1 className="text-3xl font-semibold text-gray-700 text-start">Introduction</h1>
       <div className="paragraph p-5">
          <p >SCS is a best scalable and cheap service for developers and investors.SCS provide number of services.</p>
          <p className="ml-4">
            <ul>
              <li>1) HLS Transcoder</li>
              <li>2) Static Website Hosting</li>
            </ul>
          </p>
          <HLSTranscoder/>
          <HostingServiceDoc/>
       </div>
       
       </div>
         
       </div>
       <Footer/>
      
      </div>
    </div>
  </>
    
  )
}
export default Home;