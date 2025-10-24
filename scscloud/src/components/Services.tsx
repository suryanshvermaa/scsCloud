import React from "react";
import { FaVideo } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Services:React.FC=()=>{
     const navigate=useNavigate();

     return (
          <div className="relative">
               <div className="w-full md:w-[60%] bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/20 p-4 md:p-6">
                    <h2 className="text-sm font-semibold text-slate-200">Products</h2>
                    <div className="mt-3 divide-y divide-slate-800/80">
                         <button
                              className="w-full flex items-center gap-3 py-3 text-left hover:bg-white/5 rounded-md px-2"
                              onClick={()=>navigate('/hls-transcoding-service')}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                                   <FaVideo className="text-lg"/>
                              </span>
                              <div>
                                   <div className="text-slate-100 font-medium">HLS Transcoder</div>
                                   <div className="text-xs text-slate-400">Transcode videos to adaptive HLS streams</div>
                              </div>
                         </button>

                         <button
                              className="w-full flex items-center gap-3 py-3 text-left hover:bg-white/5 rounded-md px-2"
                              onClick={()=>navigate('/hosting-service')}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                                   <IoIosCodeWorking className="text-lg"/>
                              </span>
                              <div>
                                   <div className="text-slate-100 font-medium">Static Web Hosting</div>
                                   <div className="text-xs text-slate-400">Fast, secure hosting for static sites</div>
                              </div>
                         </button>

                         <div className="w-full flex items-center gap-3 py-3 text-left opacity-60 px-2">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                                   <GrStorage className="text-lg"/>
                              </span>
                              <div>
                                   <div className="text-slate-100 font-medium">Object Storage</div>
                                   <div className="text-xs text-slate-400">Coming soon</div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default Services;