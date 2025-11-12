import React from "react";
import { FaVideo } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { HiDatabase } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { FaDocker } from "react-icons/fa";

type Props = { onNavigate?: () => void }

const Services:React.FC<Props>=({ onNavigate })=>{
     const navigate=useNavigate();

          return (
               <div className="relative">
                    <div className="w-full md:w-[60%] bg-white border border-slate-200 rounded-xl shadow-xl p-4 md:p-6 dark:bg-slate-700 dark:border-slate-600 dark:shadow-black/20">
                         <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Products</h2>
                         <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-600/50">
                         <button
                                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-900/5 dark:hover:bg-slate-600/50 rounded-md px-2"
                              onClick={()=>{ onNavigate?.(); navigate('/hls-transcoding-service') }}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/20 dark:ring-cyan-500/40">
                                   <FaVideo className="text-lg"/>
                              </span>
                                                  <div>
                                                       <div className="text-slate-900 dark:text-slate-50 font-medium">HLS Transcoder</div>
                                                       <div className="text-xs text-slate-500 dark:text-slate-300">Transcode videos to adaptive HLS streams</div>
                              </div>
                         </button>

                         <button
                                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-900/5 dark:hover:bg-slate-600/50 rounded-md px-2"
                              onClick={()=>{ onNavigate?.(); navigate('/hosting-service') }}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 dark:ring-emerald-500/40">
                                   <IoIosCodeWorking className="text-lg"/>
                              </span>
                                                  <div>
                                                       <div className="text-slate-900 dark:text-slate-50 font-medium">Static Web Hosting</div>
                                                       <div className="text-xs text-slate-500 dark:text-slate-300">Fast, secure hosting for static sites</div>
                              </div>
                         </button>

                         <button
                                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-900/5 dark:hover:bg-slate-600/50 rounded-md px-2"
                              onClick={()=>{ onNavigate?.(); navigate('/object-storage') }}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20 dark:ring-purple-500/40">
                                   <HiDatabase className="text-lg"/>
                              </span>
                                                  <div>
                                                       <div className="text-slate-900 dark:text-slate-50 font-medium">Object Storage</div>
                                                       <div className="text-xs text-slate-500 dark:text-slate-300">S3-compatible scalable object storage</div>
                              </div>
                         </button>

                         <button
                                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-900/5 dark:hover:bg-slate-600/50 rounded-md px-2"
                              onClick={()=>{ onNavigate?.(); navigate('/container-service') }}
                         >
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20 dark:ring-sky-500/40">
                                   <FaDocker className="text-lg"/>
                              </span>
                                                  <div>
                                                       <div className="text-slate-900 dark:text-slate-50 font-medium">Container Service</div>
                                                       <div className="text-xs text-slate-500 dark:text-slate-300">Run Docker images with managed hosting</div>
                              </div>
                         </button>
                    </div>
               </div>
          </div>
     )
}
export default Services;