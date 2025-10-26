import React, { useState } from 'react'
import { IoCloudOutline } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import Services from './Services';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../utils/useTheme';

const Header:React.FC=()=> {
    const [services,setServices]=useState<boolean>(false)
    const [menu,setMenu]=useState<boolean>(false)
    const navigate=useNavigate();


    const handleLogout=()=>{
        Cookies.remove("AccessCookie");
        Cookies.remove("RefreshCookie");
        navigate('/login');
    }
            const { theme, toggle } = useTheme();
            const location = useLocation();

            // Check if user is on auth pages or landing page
            const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
            const isLandingPage = location.pathname === '/';
            const isPublicPage = isAuthPage || isLandingPage;

            // Close any open menus when route changes
            React.useEffect(() => {
                setServices(false);
                setMenu(false);
            }, [location.pathname]);

        return ( <>
            <div className='w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 dark:bg-slate-700/90 dark:supports-[backdrop-filter]:bg-slate-700/80 dark:border-slate-600'>
                <div className='max-w-7xl mx-auto px-4 h-14 flex items-center justify-between'>
                {/* Brand */}
                        <div className='flex items-center gap-3 cursor-pointer' onClick={()=>navigate(isLandingPage ? '/' : '/home')}>
                            <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/5 ring-1 ring-slate-900/10 dark:bg-cyan-500/10 dark:ring-cyan-500/30'>
                                <IoCloudOutline className='h-5 w-5 text-cyan-500 dark:text-cyan-400'/>
                    </span>
                    <div className='leading-tight'>
                                <h3 className='text-base font-semibold text-slate-900 dark:text-slate-50'>SCS Cloud</h3>
                                <p className='text-[11px] text-slate-500 dark:text-slate-300 -mt-0.5'>Build · Deploy · Scale</p>
                    </div>
                </div>

                {/* Desktop nav - Only show when logged in */}
                        {!isPublicPage && <nav className='hidden md:flex items-center gap-6 text-sm'>
                    <button
                                className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
                        onClick={()=>setServices(!services)}
                    >
                        <CgMenuGridR className='text-lg'/> Services
                    </button>
                            <button className='text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white' onClick={()=>navigate('/hls-transcoder-docs')}>Docs</button>
                            <button className='text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white' onClick={()=>navigate('/amount-dashboard')}>Dashboard</button>
                            <button className='text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white' onClick={()=>navigate('/hosting-service-docs')}>Hosting</button>
                        </nav>}

                {/* Right controls */}
                <div className='flex items-center gap-3'>
                                {!isPublicPage && <button
                                    className='hidden md:inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-900/10 hover:bg-slate-900/5 dark:text-slate-100 dark:ring-slate-400/30 dark:hover:bg-slate-600/50'
                        onClick={()=>navigate('/profile')}
                    >
                        <FaRegUser className='text-base'/> Profile
                                </button>}
                                {!isPublicPage && <button
                        className='hidden md:inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-3 py-1.5 text-sm'
                        onClick={handleLogout}
                    >
                        Logout
                                </button>}
                                {isPublicPage && <button
                        className='hidden md:inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-3 py-1.5 text-sm'
                        onClick={()=>navigate(location.pathname === '/login' ? '/register' : '/login')}
                    >
                        {location.pathname === '/login' ? 'Sign Up' : 'Login'}
                    </button>}
                                <button
                                    aria-label="Toggle theme"
                                    className='inline-flex items-center justify-center h-9 w-9 rounded-md ring-1 ring-slate-900/10 hover:bg-slate-900/5 text-slate-700 dark:text-slate-100 dark:ring-slate-400/30 dark:hover:bg-slate-600/50'
                                    onClick={toggle}
                                >
                                    {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
                                </button>
                    {/* Mobile menu toggle */}
                                { !menu ? (
                                    <LuMenu className='text-2xl text-slate-800 dark:text-slate-200 md:hidden' onClick={()=>setMenu(true)} />
                    ) : (
                                    <RxCross1 className='text-2xl text-slate-800 dark:text-slate-200 md:hidden' onClick={()=>setMenu(false)} />
                    )}
                </div>
            </div>
            {/* Products dropdown */}
                    {services && (
                            <div className='hidden md:block border-t border-slate-200 dark:border-slate-600'>
                    <div className='max-w-7xl mx-auto px-4'>
                                <Services onNavigate={() => setServices(false)} />
                    </div>
                </div>
            )}
        </div>

        {/* Mobile panel */}
            {menu && !isPublicPage && (
                <div className='md:hidden fixed top-14 left-0 right-0 z-40 bg-white/95 dark:bg-slate-700/95 backdrop-blur border-b border-slate-200 dark:border-slate-600 p-4 space-y-3'>
                                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600/50' onClick={()=>{setMenu(false); setServices(false); navigate('/amount-dashboard')}}>
                        <span className='inline-flex items-center gap-2 text-slate-800 dark:text-slate-100'><HiOutlineCurrencyRupee/> Dashboard</span>
                </button>
                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600/50' onClick={()=>{setMenu(false); setServices(false); navigate('/hls-transcoder-docs')}}>
                        <span className='text-slate-800 dark:text-slate-100'>Docs</span>
                </button>
                                <button className='w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600/50' onClick={()=>{setMenu(false); setServices(false); navigate('/profile')}}>
                        <span className='inline-flex items-center gap-2 text-slate-800 dark:text-slate-100'><FaRegUser/> Profile</span>
                </button>
                                <button className='w-full text-left px-3 py-2 rounded-md bg-cyan-500/90 text-slate-900 font-semibold' onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )}
        {/* Mobile panel for public pages */}
            {menu && isPublicPage && (
                <div className='md:hidden fixed top-14 left-0 right-0 z-40 bg-white/95 dark:bg-slate-700/95 backdrop-blur border-b border-slate-200 dark:border-slate-600 p-4 space-y-3'>
                                <button className='w-full text-left px-3 py-2 rounded-md bg-cyan-500/90 text-slate-900 font-semibold' onClick={()=>{setMenu(false); navigate(location.pathname === '/login' ? '/register' : '/login')}}>
                    {location.pathname === '/login' ? 'Sign Up' : 'Login'}
                </button>
            </div>
        )}
        </>
    )
}

export default Header;