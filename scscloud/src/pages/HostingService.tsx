import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { notifier } from "../utils/notifier";

const HostingService:React.FC=()=>{
    const [loading,setLoading]=useState<string|undefined>();
    const [gitUrl,setGitUrl]=useState<string|undefined>();
    const [websiteName,setWebsiteName]=useState<string|undefined>();
  const [websiteType,setWebsiteType]=useState<string>('ViteReact');
    const [hostingServiceScreen,setHostingServiceScreen]=useState<boolean>(false);
    const [loadingData,setLoadingData]=useState<boolean>(false);
   
    

  interface IWebsite{
        _id:string;
        user:string;
        websiteUrl:string;
        websiteName:string;
    validDate:string | Date;
        websiteType:string;
    }
    const [open, setOpen] = useState<boolean>(false)
    const [selectedWebsite,setSelectedWebsite]=useState<string>('')
  const [websites,setWebsites]=useState<IWebsite[]>([])
    const navigate=useNavigate();
    const [openHost,setOpenHost]=useState<boolean>(false);

    useEffect(()=>{
        setLoadingData(true)
        const accessToken= Cookies.get("AccessCookie");
    axios.get(`${import.meta.env.VITE_API_URL}/api/host/websites?token=${accessToken}`)
    .then((res)=>{
      const data = res.data.data;
      console.log('websitesData:', data);
      setWebsites([...data.data]);
      setLoadingData(false);
    })
    .catch((err)=>{
      console.error('Failed fetching websites:', err);
      setWebsites([]);
      setLoadingData(false);
    })
    },[])

    const openRenewalModal=(id:string)=>{
        setOpen(true);
        setSelectedWebsite(id)
    }

  const compareDates=(validDate:string|Date,todayDate:string|Date)=>{
        const date1=new Date(validDate);
        const date2=new Date(todayDate);
        return date2>=date1;

    }

    const handleHostWebsite=()=>{
        setOpenHost(false);
        setLoading('hosting...')
        console.log(gitUrl);
        console.log(websiteName);
        console.log(websiteType);
       if(websiteName && websiteType && gitUrl){
        const accessToken= Cookies.get("AccessCookie");
        axios.post(`${import.meta.env.VITE_API_URL}/api/host/host-website`,{AccessCookie:accessToken,gitUrl,websiteType,websiteName})
        .then((res)=>{
            const data:any=res.data.data;
            console.log('hosted',data);
            setLoading(undefined);
            notifier.success(`your website url is ${data.websiteUrl} it will take upto 1 min to active url`);
          return  setHostingServiceScreen(false);
        }
        ).catch((err:any)=>{
          notifier.error(`error in hosting website .Insufficient amount ${err.message}`)
        })
       }else{
       return notifier.warning('all fields are required');
       }
        
       
        
        
    }

    const handleRenewValidDate=(websiteId:string)=>{
        const accessToken= Cookies.get("AccessCookie");
    axios.post(`${import.meta.env.VITE_API_URL}/api/host/renew-validity`,{AccessCookie:accessToken,websiteId}).then((res)=>{
      console.log(res.data.data);
            setOpen(false);
            notifier.success('renewed successful')
            
        }).catch((err:any)=>{
          notifier.error(`error in renewal. you have not sufficient amount to renew your website or unauthorised ${err.message}`)
        })
    }
    return (
  <>
        {
          hostingServiceScreen?
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="mb-6">
              <button className="inline-flex items-center gap-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2" onClick={()=>setHostingServiceScreen(false)}>
                ← Back
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center pb-4 border-b border-slate-200 dark:border-slate-700">Static Web Hosting</h1>
              <div className="flex justify-center items-center">
                <div className="flex flex-col md:w-[44vw] w-full gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Website Type</label>
                    <select className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md p-3 text-base" onChange={(e)=>setWebsiteType(e.target.value)}>
                      <option disabled>Choose your website type</option>
                      <option value="CreateReactApp">CreateReactApp</option>
                      <option value="ViteReact">ViteReact</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Website Name</label>
                    <input type="text" className='w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md p-3' placeholder="enter your website name..." onChange={(e)=>setWebsiteName(e.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Git URL</label>
                    <input type="text" className='w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md p-3' placeholder="enter your website git url..." onChange={(e)=>setGitUrl(e.target.value)}/>
                  </div>
                  {
                    !loading ? <button className='text-lg font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 p-3 rounded-md mt-4 w-full' onClick={()=>setOpenHost(true)}>Host Website</button>
                    :
                    <button className='text-lg font-bold text-slate-900 bg-cyan-400 p-3 rounded-md mt-4 w-full'>{loading}</button>
                  }
                </div>
              </div>
            </div>
          </div>
          :
          <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-900/10 bg-slate-900/5 px-3 py-1 text-xs text-slate-600 dark:ring-white/10 dark:bg-white/5 dark:text-slate-300 mb-4">
                Static Web Hosting Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Static Website Hosting
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                Deploy static sites instantly with our global CDN. Built for developers who ship fast.
              </p>
              <div className="flex items-center justify-center gap-4 mb-12">
                <button 
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 text-sm"
                  onClick={()=>setHostingServiceScreen(true)}
                >
                  Host a Website
                </button>
                <button 
                  className="inline-flex items-center gap-2 rounded-md ring-1 ring-slate-900/10 hover:bg-slate-900/5 dark:ring-white/10 dark:hover:bg-white/5 px-6 py-3 text-sm text-slate-700 dark:text-slate-200"
                  onClick={()=>navigate('/hosting-service-docs')}
                >
                  View Documentation
                </button>
              </div>
            </div>

            {/* Your Websites Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Your Websites</h2>
              <div className="flex flex-col gap-4">
                  {
                    !loadingData && websites.length!==0 && websites.map((website)=>(
                      <div key={website._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900 flex justify-between md:flex-row flex-col items-center gap-4 shadow-sm">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-white">Type:</span> {website.websiteType}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-white">URL:</span> <a href={website.websiteUrl} className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">{website.websiteUrl}</a>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-white">Valid till:</span> {String(website.validDate).split('T')[0]}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Status:</span>
                            {
                              compareDates(website.validDate,new Date())
                                ? <ImCross className="text-xl text-white bg-red-600 rounded-full p-1"/>
                                :
                                <TiTick className="text-xl text-white bg-green-600 rounded-full p-1"/>
                            }
                          </div>
                          <button className="px-4 py-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-medium whitespace-nowrap" onClick={()=>openRenewalModal(website._id)}>Renew (1 month)</button>
                        </div>
                      </div>
                    ))
                  }
                  {
                    loadingData && <div className="flex justify-center items-center h-[50vh] w-full">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-slate-900 dark:text-white motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
        }

    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-black/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Renew Website for a month
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-300">
                      Are you sure you want to renewal your website's validity? You will be charged for renewal charge 20rs for your website
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleRenewValidDate(selectedWebsite)}
                className="inline-flex w-full justify-center rounded-md bg-green-600 hover:bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
              >
                Renew
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <Dialog open={openHost} onClose={setOpenHost} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-black/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Host your website
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-300">
                      Are you sure you want to host your website? You will be charged for hosting charge 20rs for your website for 1 month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleHostWebsite()}
                className="inline-flex w-full justify-center rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
              >
                Host
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpenHost(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
    )
}

export default HostingService;