import React,{useState} from "react";
import { IoCloudOutline } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { notifier } from "../utils/notifier";


const Login:React.FC=()=>{
    const navigate=useNavigate();

    const [loginData,setLoginData]=useState<object | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    
    const handleLogin=async()=>{
        try {
            setLoading(true);
            console.log(import.meta.env.VITE_API_URL);
            const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/login`,loginData);
            
            if(res){
                const date1=new Date();
                date1.setHours(date1.getHours()+1)
                const date2=new Date();
                date2.setHours(date2.getHours()+12);
                Cookies.set("AccessCookie", res.data.data.cookies[0].value, {expires:date1})
                Cookies.set("RefreshCookie", res.data.data.cookies[1].value, {expires:date2})
                notifier.success("Login successful!");
                navigate('/home')
                console.log(res.data.data);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response?.data?.message) {
                notifier.error(error.response.data.message);
            } else if (error.response?.status === 401) {
                notifier.error("Invalid email or password");
            } else if (error.response?.status === 404) {
                notifier.error("User not found. Please register first.");
            } else if (error.message) {
                notifier.error(error.message);
            } else {
                notifier.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
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
             
               <div className='p-1 flex flex-col sm:w-[50%] w-full sm:pl-10 sm:mt-0 mt-16'>
               <h3 className='text-3xl sm:text-start py-5 text-center text-gray-700 dark:text-slate-100'>Login to SCS</h3>
               <p className='text-start text-gray-700 dark:text-slate-300 sm:mt-0 mt-10'>Email</p>
               <input type="email" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your email...' onChange={(e)=>setLoginData({...loginData,email:e.target.value})}/>
  
               <p className='text-start text-gray-700 dark:text-slate-300'>password</p>
               <input type="password" className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100' placeholder='enter your password...' onChange={(e)=>setLoginData({...loginData,password:e.target.value})}/>
  
               {!loading ? (
                 <button className='p-2 rounded my-2 xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] hover:bg-[#176a92] text-white sm:mt-0 mt-10' onClick={handleLogin}>Login</button>
               ) : (
                 <button className='p-2 rounded my-2 xl:mr-20 lg:mr-10 font-bold bg-[#1e81b0] opacity-70 text-white sm:mt-0 mt-10' disabled>Logging in...</button>
               )}
               <h3 className='text-2xl text-center py-5 font-semibold text-gray-700 dark:text-slate-300 sm:hidden'>OR</h3>
  
               <button className='p-2 border-solid border-2 border-gray-300 dark:border-slate-600 rounded my-2 xl:mr-20 lg:mr-10 hover:border-[#1e81b0] hover:border-2 hover:border-solid text-gray-900 dark:text-slate-100' onClick={()=>navigate('/register')}>Create a new SCS account</button>
  
           </div>
          </div>
      </div>
    )
}
export default Login;