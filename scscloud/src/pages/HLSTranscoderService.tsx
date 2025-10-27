import React, { useState,useEffect } from "react"
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FaVideo, FaCloud, FaRocket } from 'react-icons/fa';
import { notifier } from "../utils/notifier";
import { getTranscodingCost, formatCost, calculateTotalCost } from "../utils/costApi";
import { getBuckets, Bucket } from "../utils/objectStorageApi";

const HLSTranscoderService:React.FC=()=>{
  const [hlsInputScreen,setHlsInputScreen]=useState<boolean>(false);
  const [transcodingCostPerMB, setTranscodingCostPerMB] = useState<string>('0');
  const [loadingCost, setLoadingCost] = useState<boolean>(true);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState<boolean>(false);
  interface Idata{
    bucketName:string;
    bucketPath:string;
  }
  const [open,setOpen]=useState<boolean>(false);
    const [data,setData]=useState<Idata>({
      bucketName:'',
      bucketPath:''
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
      
      // Fetch transcoding cost
      const fetchCost = async () => {
        try {
          setLoadingCost(true);
          const cost = await getTranscodingCost();
          setTranscodingCostPerMB(cost);
        } catch (error) {
          console.error('Error fetching transcoding cost:', error);
          notifier.error('Failed to load pricing information');
        } finally {
          setLoadingCost(false);
        }
      };
      fetchCost();

      // Fetch buckets
      const fetchBuckets = async () => {
        try {
          setLoadingBuckets(true);
          const userBuckets = await getBuckets();
          setBuckets(userBuckets);
        } catch (error) {
          console.error('Error fetching buckets:', error);
          notifier.error('Failed to load buckets. Please ensure Object Storage is enabled.');
        } finally {
          setLoadingBuckets(false);
        }
      };
      fetchBuckets();
    },[])
    const handleUploadAndTranscode=async()=>{
      setOpen(false)
      let email='';
      let videoKey='';
       if(data.bucketName && data.bucketPath && file){
        const fileType=file?.type;
        const fileName=file?.name;
        const fileSize=file?.size;
        const videoSizeInMB = fileSize ? (fileSize / (1024 * 1024)) : 0; // Convert bytes to MB
        const fileObj={fileType,fileName,fileSize}
        console.log(fileObj);
        console.log(data);
        
        if(fileType==='video/mp4'){
          setLoading('Uploading Video...')
          const accessToken=Cookies.get("AccessCookie");
          console.log(accessToken);

          try {
            const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload-video`,{
              fileName,
              AccessCookie:accessToken,
              videoSizeInMB,
              bucketName: data.bucketName
            })
            console.log(uploadRes.data.data);
            email = uploadRes.data.data.email;
            videoKey = uploadRes.data.data.videoKey;
            console.log(uploadRes.data.data.uploadUrl);
            
            await axios.put(uploadRes.data.data.uploadUrl, file)
            setLoading('Transcoding...')
            console.log('Video uploaded successfully');
            
            const transcodingdata={
              AccessCookie: accessToken,
              videoKey: videoKey,
              bucketPath: data.bucketPath,
              userBucketName: data.bucketName,
              email: email,
              videoSizeInMB: videoSizeInMB
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
            } else if (error.response?.data?.message?.includes('Object Storage')) {
              notifier.error(error.response.data.message || 'Object Storage service is not enabled or configured.')
            } else {
              notifier.error(error.response?.data?.message || 'Error in transcoding video. Please try again.')
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

            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">Object Storage Bucket Name</label>
            {loadingBuckets ? (
              <div className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full'>
                Loading buckets...
              </div>
            ) : buckets.length > 0 ? (
              <select 
                className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full' 
                onChange={(e)=>setData({...data,bucketName:e.target.value})}
                value={data.bucketName}
              >
                <option value="">Select a bucket...</option>
                {buckets.map((bucket) => (
                  <option key={bucket.Name} value={bucket.Name}>
                    {bucket.Name}
                  </option>
                ))}
              </select>
            ) : (
              <div className='text-md font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full'>
                No buckets found. Please create a bucket in Object Storage first.
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transcoded videos will be stored in your Object Storage bucket
            </p>

            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">Bucket Path</label>
            <input type="text"  className='text-md font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 border border-slate-300 dark:border-slate-600 rounded w-full' placeholder="e.g., videos/ or transcoded/ or leave empty" onChange={(e)=>setData({...data,bucketPath:e.target.value})}/>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Optional folder path within the bucket where transcoded files will be stored
            </p>

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
                  Transcoded videos are automatically stored in your Object Storage bucket for seamless delivery.
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
                    Object Storage Integration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Transcoded videos automatically stored in your Object Storage bucket. No need for AWS credentials.
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
                    Multiple quality variants (360p, 480p, 720p, 1080p) generated automatically for optimal viewing.
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
                {loadingCost ? (
                  <p className="text-slate-600 dark:text-slate-300">Loading pricing information...</p>
                ) : (
                  <>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCost(transcodingCostPerMB)}</span> per MB of video
                    </p>
                    {file && (
                      <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          <span className="font-semibold">Selected File:</span> {file.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          <span className="font-semibold">Size:</span> {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          <span className="font-semibold">Estimated Cost:</span> {formatCost(calculateTotalCost(transcodingCostPerMB, file.size / (1024 * 1024)).toString())}
                        </p>
                      </div>
                    )}
                  </>
                )}
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
                      Are you sure you want to transcode your video? 
                      {file && (
                        <>
                          <br />
                          <span className="font-semibold mt-2 block">
                            Video size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <span className="font-semibold block">
                            Estimated cost: {formatCost(calculateTotalCost(transcodingCostPerMB, file.size / (1024 * 1024)).toString())}
                          </span>
                        </>
                      )}
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