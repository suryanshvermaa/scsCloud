import React, { useState } from 'react'
import { IoCloudOutline } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Services from './Services';

const Header:React.FC=()=> {
    const [services,setServices]=useState<boolean>(false)
    const [menu,setMenu]=useState<boolean>(false)
    const navigate=useNavigate();


    const handleLogout=()=>{
        Cookies.remove("AccessCookie");
        Cookies.remove("RefreshCookie");
        navigate('/login');
    }
  return ( <>
    <div className='w-full bg-gray-800 p-1 h-[45px] px-3 flex flex-row justify-between fixed items-center z-50'>
        <div className='flex flex-row'>
                 <div className='flex flex-row items-center hover:border-solid hover:border-[1.5px] hover:border-gray-300 px-2' onClick={()=>navigate('/home')}>
                 <IoCloudOutline className='text-4xl text-gray-300  font-extralight'/>
                 <h3 className='text-xl font-bold text-gray-300  ml-3'>SCS</h3>
             </div>
             <div className='flex flex-row items-center mx-6 cursor-pointer hover:border-solid hover:border-[1.5px] hover:border-gray-300 px-2 border-solid border-l-2 border-gray-600' onClick={()=>setServices(!services)}>
                 <CgMenuGridR className='text-3xl text-gray-300 font-extralight'/>
                 <h3 className='text-md font-medium text-gray-300  ml-2'>Services</h3>
             </div>
             <div className='md:flex flex-row items-center mx-6 cursor-pointer rounded bg-black md:my-1 px-4 hidden'>
                 <FaSearch className='text-xl text-gray-300 font-extralight'/>
                 <input className='text-md font-medium text-gray-300  ml-2 bg-transparent pl-2 py-[5px]' placeholder='services'/>
             </div>
        </div>
        <div className='flex md:flex-row flex-col'>
             {
                !menu ? <LuMenu className="text-2xl text-gray-300 font-extralight md:hidden" onClick={()=>setMenu(true)}/>:
                <RxCross1 className="text-2xl text-gray-300 font-extralight md:hidden" onClick={()=>setMenu(false)}/>
             }
             <div className='md:flex flex-row items-center mx-6 cursor-pointer rounded my-1 hover:border-solid hover:border-[1.5px] hover:border-gray-300 px-2 h-[100%] hidden ' onClick={()=>navigate('/amount-dashboard')}>
                 <HiOutlineCurrencyRupee className='text-2xl text-gray-300 font-extralight'/>
             </div>
             <div className='md:flex hidden flex-row items-center mx-2 cursor-pointer rounded my-1 hover:border-solid hover:border-[1.5px] hover:border-gray-300 h-[100%] ' onClick={()=>navigate('/profile')}>
                 <FaRegUser className='text-xl text-gray-300 font-extralight'/>
                
             </div>
             <button className='px-2 md:bg-white justify-center items-center md:rounded md:font-semibold md:flex hidden' onClick={handleLogout}>Logout</button>

             
        </div>
       
        
    </div>
     {
        menu &&<div className='absolute z-50 mt-[45px] w-full flex flex-col justify-center items-center bg-gray-300 p-5 md:hidden'>
             <div className='flex flex-row items-center mx-6 cursor-pointer my-1 px-2 ' onClick={()=>navigate('/amount-dashboard')}>
             <HiOutlineCurrencyRupee className='text-2xl text-gray-700 font-extralight'/>
             <h3 className='text-xl font-medium text-gray-700  ml-2'>Amount Dashboard</h3>
         </div>
         <div className='flex flex-row items-center mx-2 cursor-pointer  my-6'  onClick={()=>navigate('/profile')}>
             <FaRegUser className='text-xl text-gray-700 font-extralight'/>
             <h3 className='text-xl font-medium text-gray-700  ml-2'>User</h3>
            
         </div>
         <button className='p-2 px-3 bg-gray-700 justify-center items-center text-white text-xl rounded font-semibold mt-4' onClick={handleLogout}>Logout</button>

        </div>
    }{
        services && <Services/>
      }
    </>
  )
}

export default Header;