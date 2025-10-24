import React,{useState} from "react";
import { IoCloudOutline } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const Login:React.FC=()=>{
    const navigate=useNavigate();

    const [loginData,setLoginData]=useState<object | undefined>();
    const handleLogin=async()=>{
         console.log(import.meta.env.VITE_API_URL);
         const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/login`,loginData);
       if(res){
        const date1=new Date();
        date1.setHours(date1.getHours()+1)
        const date2=new Date();
        date2.setHours(date2.getHours()+12);
        Cookies.set("AccessCookie", res.data.data.cookies[0].value, {expires:date1})
        Cookies.set("RefreshCookie", res.data.data.cookies[1].value, {expires:date2})
  navigate('/home')
  console.log(res.data.data);
       }
         
         
    }

  
    return (
      <div className='h-full w-full p-6'>
          <h1 className='text-center font-bold text-4xl m-4'>SCS</h1>
          <div className='sm:flex sm:flex-row'>
              <div className='p-3 sm:flex sm:flex-col w-[50%] items-center border-solid border-r-2 hidden'>
              <div ><IoCloudOutline className='md:text-[250px] sm:text-[200px] text-gray-700 font-extralight'/></div>
              <h3 className='text-5xl text-center text-gray-700'>Welocome to SCS</h3>
              <h3 className='text-5xl text-center text-gray-700'>Cloud</h3>
  
              </div>
             
               <div className='p-1 flex flex-col sm:w-[50%] w-full sm:pl-10 sm:mt-0 mt-16'>
               <h3 className='text-3xl sm:text-start py-5 text-center  text-gray-700'>Login to SCS</h3>
               <p className='text-start text-gray-700 sm:mt-0 mt-10'>Email</p>
               <input type="email" className=' p-2 border-solid border-2 rounded my-2 xl:mr-20  lg:mr-10 ' placeholder='enter your email...' onChange={(e)=>setLoginData({...loginData,email:e.target.value})}/>
  
               <p className='text-start text-gray-700'>password</p>
               <input type="password" className=' p-2 border-solid border-2 rounded my-2 xl:mr-20 lg:mr-10' placeholder='enter your password...' onChange={(e)=>setLoginData({...loginData,password:e.target.value})}/>
  
               <button className=' p-2 rounded my-2 xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] text-white sm:mt-0 mt-10' onClick={handleLogin}>Login</button>
               <h3 className='text-2xl text-center py-5 font-semibold  text-gray-700 sm:hidden'>OR</h3>
  
               <button className=' p-2 border-solid border-2 rounded my-2 xl:mr-20 lg:mr-10 hover:border-[#1e81b0] hover:border-2 hover:border-solid' onClick={()=>navigate('/register')}>Create a new SCS account</button>
  
           </div>
          </div>
      </div>
    )
}
export default Login;