import Footer from "../components/Footer"
import Header from "../components/Header"
import React, { useState,useEffect } from "react"
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HLSImage from '../assets/hlsTrascoder.png';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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
        setLoading('Uploading Video...')
        const fileType=file?.type;
        const fileName=file?.name;
        const fileSize=file?.size;
        const fileObj={fileType,fileName,fileSize}
        console.log(fileObj);
        console.log(data);
        if(fileType==='video/mp4'){
          const accessToken=Cookies.get("AccessCookie");
          console.log(accessToken);

          axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload-video`,{fileName,AccessCookie:accessToken})
          .then((res)=>{
            console.log(res.data.data);
             email=res.data.data.email;
             videoKey=res.data.data.videoKey;
            //one route after this
            axios.put(res.data.data.uploadUrl,file).then((res)=>{
              setLoading('transcoding...')
              console.log(res);
              
              
            const transcodingdata={
              email,
              videoKey,
              userAccessKey:data.accessKey,
              userSecretAccessKey:data.secretAccessKey,
              bucketPath:data.destinationFolder,
              userBucketName:data.bucketName,
              AccessCookie:accessToken
            }
            axios.post('https://api.suryanshverma.site/api/v1/transcoding-video',transcodingdata).then((res)=>{
              console.log(res.data.data);
              setLoading('')
              alert('we are transcoding your video. when transcoding is complete. we will notify you through email')
             return navigate('/home')
              
            })
            })
            setLoading('');
            return alert('error in transcoding video')
            
          })
          setLoading('');
          setLoading('');
            return alert('you have not sufficient amount')
        }else{
          setLoading('');
          return alert('video should be type of mp4')
          
        }
        
        
        //type should be video/mp4
       } else{
        alert('all fields are required')
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
        <Header/>
        <div className="h-[45px]"></div>
        
           { hlsInputScreen ?
            <div>
              <button className="bg-gray-700 text-gray-200 font-bold rounded absolute p-2 px-3 m-2" onClick={()=>setHlsInputScreen(false)}>Back</button>
               <div className="w-full flex justify-center mx-3">  <h1 className="text-3xl font-bold text-gray-900 border-solid border-b-2 border-gray-400 w-[32%] inline text-center p-2 w-auto"> HLS Transcoder Service </h1></div>
        
        <div className="flex justify-center items-center">

        <div className="flex flex-col md:w-[44vw]  justify-center w-full p-4">
            <label className="text-xl font-semibold text-gray-800">Your Video File</label>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-5"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  select video of type .mp4
                </p>
              </div>
              <input  type="file" id="dropzone-file" className="hidden fileUpload"  onChange={setFileVideo}/>
            </label>

            <label className="text-xl font-semibold text-gray-800 mt-5"> Bucket Name</label>
            <input type="text"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded w-full' placeholder="enter your s3 bucket name..." onChange={(e)=>setData({...data,bucketName:e.target.value})}/>

            <label className="text-xl font-semibold text-gray-800 mt-5">Destination folder</label>
            <input type="text"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded w-full' placeholder="enter destination folder on your s3..." onChange={(e)=>setData({...data,destinationFolder:e.target.value})}/>

            <label className="text-xl font-semibold text-gray-800 mt-5">AWS credentials</label>
            <input type="text"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded w-full' placeholder="accessKeyId..." onChange={(e)=>setData({...data,accessKey:e.target.value})}/>
            <input type="password"  className='text-md font-medium text-gray-600  bg-transparent p-3 border-solid border-gray-300 border-2 rounded mt-2 w-full' placeholder="secretAccessKey..." onChange={(e)=>setData({...data,secretAccessKey:e.target.value})}/>

            {
              !loading ? <button className='text-lg font-bold text-cyan-900 bg-cyan-400 p-3 rounded mt-10 mb-20 w-full' onClick={()=>setOpen(true)}>Transcode video</button>
              :
              <button className='text-lg font-bold text-cyan-900 bg-cyan-400 p-3 rounded mt-10 mb-20 w-full'>{loading}</button>
            }

          </div>



        </div>

            </div>:
            <div>
                <div className="w-full flex justify-center mx-3">  <h1 className="text-3xl font-bold text-gray-900 border-solid border-b-2 border-gray-400 w-[32%] inline text-center p-2 w-auto"> HLS Transcoder Service </h1></div>
                <div className=" items-center flex flex-col p-3">
                  <div className="md:w-[88%] w-full rounded-md shadow shadow-gray-600"><img src={HLSImage} alt="hlsserviceImage"  /></div>
                  <div className="mt-4 w-full flex justify-center">
                    <button className="bg-cyan-400 rounded p-3 text-xl font-bold text-gray-700 mx-2" onClick={()=>setHlsInputScreen(true)}>Start Transcoding</button>
                    <button className="bg-gray-600 rounded p-3 text-xl font-bold text-gray-200 mx-2" onClick={()=>navigate('/hls-transcoder-docs')}>Documentation</button>
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
                    transcode your video
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to transcode your video? You will be charged for transcoding charge 20rs for your video
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>handleUploadAndTranscode()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                transcode
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
        <Footer/>
        </>
    )
}

export default HLSTranscoderService;