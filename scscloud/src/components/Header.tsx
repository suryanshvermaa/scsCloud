import React, { useState } from 'react'
import { IoCloudOutline } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
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
        <div className='w-full fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 border-b border-slate-800'>
            <div className='max-w-7xl mx-auto px-4 h-14 flex items-center justify-between'>
                {/* Brand */}
                <div className='flex items-center gap-3 cursor-pointer' onClick={()=>navigate('/home')}>
                    <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10'>
                        <IoCloudOutline className='h-5 w-5 text-cyan-400'/>
                    </span>
                    <div className='leading-tight'>
                        <h3 className='text-base font-semibold text-slate-100'>SCS Cloud</h3>
                        <p className='text-[11px] text-slate-400 -mt-0.5'>Build · Deploy · Scale</p>
                    </div>
                </div>

                {/* Desktop nav */}
                <nav className='hidden md:flex items-center gap-6 text-sm'>
                    <button
                        className='inline-flex items-center gap-2 text-slate-300 hover:text-white'
                        onClick={()=>setServices(!services)}
                    >
                        <CgMenuGridR className='text-lg'/> Products
                    </button>
                    <button className='text-slate-300 hover:text-white' onClick={()=>navigate('/hls-transcoder-docs')}>Docs</button>
                    <button className='text-slate-300 hover:text-white' onClick={()=>navigate('/amount-dashboard')}>Dashboard</button>
                    <button className='text-slate-300 hover:text-white' onClick={()=>navigate('/hosting-service-docs')}>Hosting</button>
                </nav>

                {/* Right controls */}
                <div className='flex items-center gap-3'>
                    <button
                        className='hidden md:inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-200 ring-1 ring-white/10 hover:bg-white/5'
                        onClick={()=>navigate('/profile')}
                    >
                        <FaRegUser className='text-base'/> Profile
                    </button>
                    <button
                        className='hidden md:inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-3 py-1.5 text-sm'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    {/* Mobile menu toggle */}
                    { !menu ? (
                        <LuMenu className='text-2xl text-slate-200 md:hidden' onClick={()=>setMenu(true)} />
                    ) : (
                        <RxCross1 className='text-2xl text-slate-200 md:hidden' onClick={()=>setMenu(false)} />
                    )}
                </div>
            </div>
            {/* Products dropdown */}
            {services && (
                <div className='hidden md:block border-t border-slate-800'>
                    <div className='max-w-7xl mx-auto px-4'>
                        <Services/>
                    </div>
                </div>
            )}
        </div>

        {/* Mobile panel */}
        {menu && (
            <div className='md:hidden fixed top-14 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700 p-4 space-y-3'>
                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-slate-200' onClick={()=>{setMenu(false); setServices(false); navigate('/amount-dashboard')}}>
                    <span className='inline-flex items-center gap-2'><HiOutlineCurrencyRupee/> Dashboard</span>
                </button>
                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-slate-200' onClick={()=>{setMenu(false); setServices(false); navigate('/hls-transcoder-docs')}}>
                    Docs
                </button>
                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-slate-200' onClick={()=>{setMenu(false); setServices(false); navigate('/profile')}}>
                    <span className='inline-flex items-center gap-2'><FaRegUser/> Profile</span>
                </button>
                <button className='w-full text-left px-3 py-2 rounded-md bg-cyan-500/90 text-slate-900 font-semibold' onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )}
        </>
    )
}

export default Header;