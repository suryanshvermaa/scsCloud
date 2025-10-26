import React, { useState,useEffect } from "react"
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FaVideo, FaCloud, FaRocket } from 'react-icons/fa';
import { notifier } from "../utils/notifier";

const HLSTranscoderService:React.FC=()=>{
  const [hlsInputScreen,setHlsInputScreen]=useState<boolean>(false);
  interface Idata{
    accessKey:string,
    secretAccessKey:string;
    destinationFolder:string;
    bucketName:string 
  }
  const [open,setOpen]=useState<boolean>(false);
    const [data,setData]=useState<Idata>({
      accessKey:'',
      secretAccessKey:'',
      destinationFolder:'',
      bucketName:''
    });
    const [loading,setLoading]=useState<string>('')
    const [file,setFile]=useState<File>();
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
    const handleUploadAndTranscode=async()=>{
      setOpen(false)
      let email='';
      let videoKey='';
       if(data.accessKey && data.bucketName && data.destinationFolder && data.secretAccessKey && file){
        const fileType=file?.type;
        const fileName=file?.name;
        const fileSize=file?.size;
        const fileObj={fileType,fileName,fileSize}
        console.log(fileObj);
        console.log(data);
        
        if(fileType==='video/mp4'){
          setLoading('Uploading Video...')
          const accessToken=Cookies.get("AccessCookie");
          console.log(accessToken);

          try {
            const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload-video`,{fileName,AccessCookie:accessToken})
            console.log(uploadRes.data.data);
            email = uploadRes.data.data.email;
            videoKey = uploadRes.data.data.videoKey;
            console.log(uploadRes.data.data.uploadUrl);
            
            await axios.put(uploadRes.data.data.uploadUrl, file)
            setLoading('Transcoding...')
            console.log('Video uploaded successfully');
            
            const transcodingdata={
              email,
              videoKey,
              userAccessKey:data.accessKey,
              userSecretAccessKey:data.secretAccessKey,
              bucketPath:data.destinationFolder,
              userBucketName:data.bucketName,
              AccessCookie:accessToken
            }
            
            const transcodingRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/transcoding-video`,transcodingdata)
            console.log(transcodingRes.data.data);
            setLoading('')
            notifier.success('We are transcoding your video. When transcoding is complete, we will notify you through email.')
            navigate('/home')
          } catch (error: any) {
            setLoading('');
            console.error('Error during transcoding:', error);
            if (error.response?.status === 402 || error.response?.data?.message?.includes('sufficient')) {
              notifier.error('You do not have sufficient balance to transcode this video.')
            } else {
              notifier.error('Error in transcoding video. Please try again.')
            }
          }
        }else{
          setLoading('');
          notifier.error('Video should be type of mp4')
        }
       } else{
        notifier.warning('All fields are required')
       } 
    }
    const setFileVideo=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const fileList=e.target.files;
        if(fileList){
            setFile(e.target.files?.[0])
        }
    }



    return (
  <>
        
           { hlsInputScreen ?
            <div className="max-w-5xl mx-auto px-6 py-10">
              <button className="mb-6 inline-flex items-center gap-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold px-4 py-2 text-sm dark:bg-slate-700 dark:hover:bg-slate-600" onClick={()=>setHlsInputScreen(false)}>
                ← Back
              </button>
               <div className="text-center mb-8">
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-700 pb-3 inline-block">
                   Configure HLS Transcoding Job
                 </h1>
               </div>
        
        <div className="flex justify-center items-center">

        <div className="flex flex-col w-full max-w-2xl p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Video File</label>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 mt-3"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Click to upload </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  select video of type .mp4
                </p>
              </div>
              <input  type="file" id="dropzone-file" className="hidden fileUpload"  onChange={setFileVideo}/>
            </label>

            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5"> Bucket Name</label>
            <input type="text"  className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full' placeholder="enter your s3 bucket name..." onChange={(e)=>setData({...data,bucketName:e.target.value})}/>

            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">Destination folder</label>
            <input type="text"  className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full' placeholder="enter destination folder on your s3..." onChange={(e)=>setData({...data,destinationFolder:e.target.value})}/>

            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">AWS credentials</label>
            <input type="text"  className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full' placeholder="accessKeyId..." onChange={(e)=>setData({...data,accessKey:e.target.value})}/>
            <input type="password"  className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded mt-2 w-full' placeholder="secretAccessKey..." onChange={(e)=>setData({...data,secretAccessKey:e.target.value})}/>

            {
              !loading ? <button className='text-lg font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 p-3 rounded mt-10 mb-6 w-full' onClick={()=>setOpen(true)}>Transcode video</button>
              :
              <button className='text-lg font-bold text-slate-900 bg-cyan-400 p-3 rounded mt-10 mb-6 w-full' disabled>{loading}</button>
            }

          </div>



        </div>

            </div>:
            <div className="max-w-7xl mx-auto px-6 py-10">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-900/10 bg-slate-900/5 px-3 py-1 text-xs text-slate-600 dark:ring-white/10 dark:bg-white/5 dark:text-slate-300 mb-4">
                  <FaVideo className="text-cyan-500" /> Video Transcoding Platform
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                  HLS Transcoder Service
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                  Transform your videos into adaptive HLS streams with scalable, on-demand transcoding. 
                  Deliver smooth playback across all devices and network conditions.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    className="inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 text-sm"
                    onClick={()=>setHlsInputScreen(true)}
                  >
                    <FaRocket /> Start Transcoding
                  </button>
                  <button 
                    className="inline-flex items-center gap-2 rounded-md ring-1 ring-slate-900/10 hover:bg-slate-900/5 dark:ring-white/10 dark:hover:bg-white/5 px-6 py-3 text-sm text-slate-700 dark:text-slate-200"
                    onClick={()=>navigate('/hls-transcoder-docs')}
                  >
                    View Documentation
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20 mb-4">
                    <FaCloud className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Cloud-Native
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Fully managed infrastructure scales automatically with your workload. No servers to maintain.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 mb-4">
                    <FaVideo className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Adaptive Streaming
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Multiple quality variants generated automatically for optimal viewing on any device or bandwidth.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/20 mb-4">
                    <FaRocket className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Fast Processing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Parallel transcoding pipeline delivers results quickly. Email notification on completion.
                  </p>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Simple Pricing</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  ₹20 per video transcoding job. Upload your video, configure your S3 destination, and we'll handle the rest.
                </p>
              </div>
            </div>
           }

           
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-black/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    transcode your video
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-300">
                      Are you sure you want to transcode your video? You will be charged for transcoding charge 20rs for your video
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleUploadAndTranscode()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 hover:bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
              >
                transcode
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
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

export default HLSTranscoderService;