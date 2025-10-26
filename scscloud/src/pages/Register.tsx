import React, { useState } from 'react'
import { IoCloudOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


const Register:React.FC=()=> {
  const navigate=useNavigate();
  // (['RefreshCookie','AccessCookie','authCookie']);
 
  const [emailLoading,setEmailLoading]=useState<boolean>(false)
  const [verifyingOtp,setVerifyingOtp]=useState<boolean>(false)
  const [registerData,setRegisterData]=useState<object | undefined>();
  const [emailScreen,setEmailScreen]=useState<boolean>(false);
  const [OTP,setOTP]=useState<number|undefined>();
  const handleVerify=async()=>{
       setEmailLoading(true)
      //  const data=registerData;
       console.log(registerData);
       //api call
  const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/register`,registerData);
  console.log(res.data.data);
  Cookies.set("authCookie", res.data.data.cookie.value, {expires:Date.now()+900000})
       setEmailLoading(false)
       setEmailScreen(true);
  }
  const handleEmail=async()=>{
    setVerifyingOtp(true)
    console.log(OTP);
    const cookie=Cookies.get("authCookie");
    const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/verify-email`,{OTP:OTP,cookie});
    if(res.data.data){
      console.log(res.data.data);
      setVerifyingOtp(false)
       navigate('/login')
    }
    
  }

  return (
    <div className='h-full w-full p-6'>
        <h1 className='text-center font-bold text-4xl m-4 text-slate-900 dark:text-slate-50'>SCS</h1>
        <div className='sm:flex sm:flex-row'>
            <div className='p-3 sm:flex sm:flex-col w-[50%] items-center border-solid border-r-2 border-gray-300 dark:border-slate-600 hidden'>
            <div ><IoCloudOutline className='md:text-[250px] sm:text-[200px] text-gray-700 dark:text-slate-400 font-extralight'/></div>
            <h3 className='text-5xl text-center text-gray-700 dark:text-slate-200'>Welocome to SCS</h3>
            <h3 className='text-5xl text-center text-gray-700 dark:text-slate-200'>Cloud</h3>

            </div>
           {
             !emailScreen? <div className='p-1 flex flex-col sm:w-[50%] w-full sm:pl-10 sm:mt-0 mt-16'>
             <h3 className='text-3xl sm:text-start py-5 text-center text-gray-700 dark:text-slate-100'>SignUp to SCS</h3>
             <p className='text-start text-gray-700 dark:text-slate-300 sm:mt-0 mt-10'>Email</p>
             <input type="email" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your email...' onChange={(e)=>setRegisterData({...registerData,email:e.target.value})}/>

             <p className='text-start text-gray-700 dark:text-slate-300'>password</p>
             <input type="password" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your password...' onChange={(e)=>setRegisterData({...registerData,password:e.target.value})}/>

             <p className='text-start text-gray-700 dark:text-slate-300'>Name</p>
             <input type="text" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your Name...' onChange={(e)=>setRegisterData({...registerData,name:e.target.value})} />

          {
            !emailLoading? <button className='p-2 rounded my-2 xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] hover:bg-[#176a92] text-white sm:mt-0 mt-10' onClick={handleVerify}>Verify your email</button>:
            <button className='p-2 rounded my-2 xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] opacity-70 text-white sm:mt-0 mt-10'>Loading...</button>
          }
             <h3 className='text-2xl text-center py-5 font-semibold text-gray-700 dark:text-slate-300 sm:hidden'>OR</h3>

             <button className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 hover:border-[#1e81b0] hover:border-2 hover:border-solid text-gray-900 dark:text-slate-100' onClick={()=>navigate('/login')}>Signin to an existing account</button>

         </div>
         :
         <div className='p-1 flex flex-col sm:w-[50%] w-full sm:pl-10 sm:mt-0 mt-16'>
                 <h3 className='text-3xl sm:text-start py-5 text-gray-700 dark:text-slate-100 text-center sm:ml-10'>Verify your email</h3>
                 <div className='w-full flex justify-center'><IoCloudOutline className='text-[150px] text-gray-300 dark:text-slate-500 font-extralight text-center'/></div>
             <p className='text-start text-gray-700 dark:text-slate-300 sm:mt-0 font-light mt-10 mb-5 sm:w-[80%] w-[100%]'>Please check your email and enter your otp so we can verify you that your email is correct or not</p>
             <input type="text" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your OTP...' onChange={(e)=>setOTP(parseInt(e.target.value))}/>
           
              
             {
              !verifyingOtp ? <button className='p-2 rounded xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] hover:bg-[#176a92] text-white sm:mt-6 mt-8' onClick={handleEmail}>Submit</button>
              :
              <button className='p-2 rounded xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] opacity-70 text-white sm:mt-6 mt-8'>Verifying</button>
             }
            </div>
         
           }
        </div>
    </div>
  )
}

export default Register; 