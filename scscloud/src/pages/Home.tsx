import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FaVideo } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import SCSCloudImage from '../assets/SCSCloud.png';

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
                Cookies.set("AccessCookie", res.data.data.cookies[0].value, {expires:date1})
                Cookies.set("RefreshCookie", res.data.data.cookies[1].value, {expires:date2})
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
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                Production-ready in minutes
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-white">
                Ship cloud apps faster with SCS Cloud
              </h1>
              <p className="mt-4 text-slate-300 text-sm md:text-base max-w-prose">
                Deploy static sites, transcode videos to HLS, and scale with confidence. Unified developer experience, transparent pricing.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button className="inline-flex items-center justify-center rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-2 text-sm" onClick={()=>navigate('/register')}>
                  Get started
                </button>
                <button className="inline-flex items-center justify-center rounded-md ring-1 ring-white/10 hover:bg-white/5 px-4 py-2 text-sm" onClick={()=>navigate('/hls-transcoder-docs')}>
                  Read the docs
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur shadow-xl">
                <img src={SCSCloudImage} alt="SCS Cloud" className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <h2 className="text-xl font-semibold text-slate-200">Core services</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition cursor-pointer" onClick={()=>navigate('/hls-transcoding-service')}>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
              <FaVideo />
            </div>
            <h3 className="mt-3 font-semibold text-slate-100">HLS Transcoder</h3>
            <p className="mt-1 text-sm text-slate-400">Adaptive streaming made easy with scalable transcoding pipelines.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition cursor-pointer" onClick={()=>navigate('/hosting-service')}>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <IoIosCodeWorking />
            </div>
            <h3 className="mt-3 font-semibold text-slate-100">Static Web Hosting</h3>
            <p className="mt-1 text-sm text-slate-400">Global CDN, instant rollbacks, and zero-config deployments.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 opacity-60">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
              <GrStorage />
            </div>
            <h3 className="mt-3 font-semibold text-slate-100">Object Storage</h3>
            <p className="mt-1 text-sm text-slate-400">Coming soon</p>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home;