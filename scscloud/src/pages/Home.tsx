import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FaVideo, FaChartLine, FaServer, FaRocket, FaClock, FaShieldAlt, FaDatabase } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { MdSpeed } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
    <div className="relative min-h-screen">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 dark:from-cyan-600 dark:via-blue-600 dark:to-blue-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white mb-6">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              System Status: All Services Operational
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to Your Dashboard
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Manage your services, monitor performance, and scale your applications with enterprise-grade infrastructure.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Global CDN</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="group relative bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate('/hls-transcoding-service')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300">
                <FaVideo className="text-2xl" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
                Video Transcoding
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Convert and optimize videos for adaptive streaming with our powerful HLS transcoding pipeline.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 group-hover:gap-3 transition-all">
                Go to service
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="group relative bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate('/hosting-service')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                <IoIosCodeWorking className="text-2xl" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
                Web Hosting
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Deploy static sites with lightning-fast global CDN distribution and automatic HTTPS.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
                Go to service
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="group relative bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate('/object-storage')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                <FaDatabase className="text-2xl" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
                Object Storage
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                S3-compatible scalable storage for files, backups, and application data.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all">
                Go to service
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="group relative bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate('/container-service')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg group-hover:shadow-sky-500/50 group-hover:scale-110 transition-all duration-300">
                <FaServer className="text-2xl" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
                Container Service
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Deploy and manage Docker containers with auto-scaling and load balancing.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 group-hover:gap-3 transition-all">
                Go to service
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="group relative bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate('/amount-dashboard')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg group-hover:shadow-amber-500/50 group-hover:scale-110 transition-all duration-300">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
                Billing Dashboard
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor your usage, track costs, and manage billing with real-time insights.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                View dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Why Choose SCS Cloud?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Built for developers, designed for scale, optimized for performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/20 dark:ring-cyan-500/40 mx-auto">
              <FaRocket className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Lightning Fast
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Deploy in seconds with optimized infrastructure and global CDN distribution.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 dark:ring-emerald-500/40 mx-auto">
              <FaShieldAlt className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Enterprise Security
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Built-in DDoS protection, SSL certificates, and compliance-ready infrastructure.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20 dark:ring-purple-500/40 mx-auto">
              <FaServer className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Auto Scaling
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Handle traffic spikes effortlessly with automatic resource scaling.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 dark:ring-blue-500/40 mx-auto">
              <FaClock className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              99.9% Uptime
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Industry-leading SLA with redundant infrastructure and automatic failover.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20 dark:ring-orange-500/40 mx-auto">
              <FaChartLine className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Real-time Analytics
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Monitor performance and usage with detailed insights and dashboards.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 ring-1 ring-pink-500/20 dark:ring-pink-500/40 mx-auto">
              <MdSpeed className="text-2xl" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Developer First
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              RESTful APIs, comprehensive docs, and SDKs for seamless integration.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 p-12 md:p-16 shadow-2xl">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          
          {/* Floating decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Need Help Getting Started?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Explore our comprehensive documentation and resources to make the most of SCS Cloud.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 text-slate-900 font-semibold px-8 py-4 text-base shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                onClick={() => navigate('/hls-transcoder-docs')}
              >
                <span className="relative z-10">View Documentation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
              <button 
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-xl border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-4 text-base backdrop-blur-sm transition-all duration-300"
                onClick={() => navigate('/profile')}
              >
                Account Settings
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            
            <p className="mt-6 text-sm text-white/80">
              24/7 Support Available · Comprehensive Guides · Video Tutorials
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home;