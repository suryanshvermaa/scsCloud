import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const HostingService:React.FC=()=>{
    const [loading,setLoading]=useState<string|undefined>();
    const [gitUrl,setGitUrl]=useState<string|undefined>();
    const [websiteName,setWebsiteName]=useState<string|undefined>();
    const [websiteType,setWebsiteType]=useState<string>('viteReact');
    const [hostingServiceScreen,setHostingServiceScreen]=useState<boolean>(false);
    const [loadingData,setLoadingData]=useState<boolean>(false);
   
    

    interface IWebsite{
        _id:string;
        user:string;
        websiteUrl:string;
        websiteName:string;
        validDate:Date;
        websiteType:string;
    }
    const [open, setOpen] = useState<boolean>(false)
    const [selectedWebsite,setSelectedWebsite]=useState<string>('')
    const [websites,setWebsites]=useState<Array<IWebsite> |undefined>()
    const navigate=useNavigate();
    const [openHost,setOpenHost]=useState<boolean>(false);

    useEffect(()=>{
        setLoadingData(true)
        const accessToken= Cookies.get("AccessCookie");
        axios.get(`${import.meta.env.VITE_API_URL}/api/host/websites?token=${accessToken}`)
        .then((res)=>{
            const websitesData=res.data.data;
            console.log(websitesData);
            setWebsites(websitesData)
            setLoadingData(false)
        })
    },[])

    const openRenewalModal=(id:string)=>{
        setOpen(true);
        setSelectedWebsite(id)
    }

    const compareDates=(validDate:Date,todayDate:Date)=>{
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
            const data:any=res.data;
            console.log('hosted',data);
            setLoading(undefined);
            alert(`your website url is ${data.data.websiteUrl} it will take upto 1 min to active url`);
          return  setHostingServiceScreen(false);
        }
        ).catch((err:any)=>{
          alert(`error in hosting website .Insufficient amount ${err.message}`)
        })
       }else{
       return alert('all fields are required');
       }
        
       
        
        
    }

    const handleRenewValidDate=(websiteId:string)=>{
        const accessToken= Cookies.get("AccessCookie");
        axios.post(`${import.meta.env.VITE_API_URL}/api/host/renew-validity`,{AccessCookie:accessToken,websiteId}).then((res)=>{
            console.log(res.data);
            setOpen(false);
            alert('renewed successful')
            
        }).catch((err:any)=>{
          alert(`error in renewal. you have not sufficient amount to renew your website or unauthorised ${err.message}`)
        })
    }
    return (
        <>
        <Header/>
        <div className="h-[45px]"></div>
    {
        hostingServiceScreen?
        <div>
        <button className="bg-gray-700 text-gray-200 font-bold rounded absolute p-2 px-3 m-2" onClick={()=>setHostingServiceScreen(false)}>Back</button>
         <div className="w-full flex justify-center mx-3">  <h1 className="text-3xl font-bold text-gray-900 border-solid border-b-2 border-gray-400 inline text-center p-2 w-auto">Static Web Hosting</h1></div>
  
  <div className="flex justify-center items-center">

  <div className="flex flex-col md:w-[44vw]  justify-center w-full p-4">
      
 
       <select className="border-solid border-gray-400 border-[1.5px] rounded p-2 px-4 text-xl" onChange={(e)=>setWebsiteType(e.target.value)}>
        <option disabled>Choose your website type</option>
        <option value="CreateReactApp">CreateReactApp</option>
        <option value="ViteReact">ViteReact</option>
      </select>



      <label className="text-xl font-semibold text-gray-800 mt-5">Website Name</label>
      <input type="text"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded w-full' placeholder="enter your websit name..."  onChange={(e)=>setWebsiteName(e.target.value)}/>

      <label className="text-xl font-semibold text-gray-800 mt-5">Git url</label>
      <input type="text"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded w-full' placeholder="enter your website git url..."  onChange={(e)=>setGitUrl(e.target.value)}/>

      {
              !loading ? <button className='text-lg font-bold text-cyan-900 bg-cyan-400 p-3 rounded mt-10 mb-20 w-full' onClick={()=>setOpenHost(true)}>Host Website</button>
              :
              <button className='text-lg font-bold text-cyan-900 bg-cyan-400 p-3 rounded mt-10 mb-20 w-full'>{loading}</button>
            }


    </div>
    </div>
    </div>
        :
        <div>
        <div className="w-full flex justify-center mx-3">  <h1 className="text-3xl font-bold text-gray-900 border-solid border-b-2 border-gray-400 w-[32%] inline text-center p-2 w-auto"> Static web hosting Service </h1></div>
        <div className=" items-center flex flex-col p-3">
            <div className="w-full rounded-md bg-gray-200 p-4">
              <h1 className="text-2xl font-semibold my-3 text-center">Your websites</h1>
             <div className="flex flex-col gap-3">
                             {
                               !loadingData && websites && websites.map((website)=>(
                                    <div key={website._id} className=" mx-3 my-1 rounded p-4 bg-white shadow flex justify-between md:flex-row flex-col  items-center gap-1 shadow">
                                  <h1 className="font-semibold">{website.websiteType}</h1>
                                  <h1 className="font-semibold">url: <a href={website.websiteUrl} className="text-blue-600 font-bold">{website.websiteUrl}</a></h1>
                                  <h1>valid till: <b>{String(website.validDate).split('T')[0]}</b></h1>
                                  <h1>status</h1>{
                                    compareDates(website.validDate,new Date())
                                     ? <ImCross className="text-3xl text-gray-200 bg-red-700 rounded-full p-1 "/> :
                                    <TiTick className="text-3xl text-gray-200 bg-green-700 rounded-full "/>
                                  }
                                  <button className="bg-gray-500 text-white p-2 rounded" onClick={()=>openRenewalModal(website._id)}>Increase validity(1 month)</button>

                             </div>
                                ))
                             }{
                                loadingData && <div className="flex justify-center items-center h-[50vh] w-[90bw]">

                                <div
                                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                role="status">
                                <span
                                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                  >Loading...</span>
                              </div>
                               </div>
                             }

             </div>
            </div>
          
          <div className="mt-4 w-full flex justify-center">
            <button className="bg-cyan-400 rounded p-3 text-xl font-bold text-gray-700 mx-2" onClick={()=>setHostingServiceScreen(true)}>Host a website</button>
            <button className="bg-gray-600 rounded p-3 text-xl font-bold text-gray-200 mx-2" onClick={()=>navigate('/hosting-service-docs')}>Documentation</button>
            </div>
        </div>

    </div>
    
    }

<Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Renew Website for a month
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to renewal your website's validity? You will be charged for renewal charge 20rs for your website
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleRenewValidDate(selectedWebsite)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Renew
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <Dialog open={openHost} onClose={setOpenHost} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    host your website
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to host your website? You will be charged for hosting charge 20rs for your website for 1 month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleHostWebsite()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                host
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpenHost(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    <Footer/>
    </>
    )
}

export default HostingService;