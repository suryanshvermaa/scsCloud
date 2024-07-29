import Footer from "../components/Footer";
import Header from "../components/Header";
import UserImage from '../assets/user.jpg';
import { TiTick } from "react-icons/ti";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";

const Profile:React.FC=()=>{
    interface IUser{
       email:string;
       name:string;
       SCSCoins:number;
       __v:number;
       updatedAt:Date;
       paymentCount:number;
       paymentAmount:number;

    }
    interface IPaymentHistory{
        _id:number;
        orderId:string;
        amount:number;
        paymentId:string;
        updatedAt:string;
    }

    const paymentData=[
       {
        _id:1,
        orderId:'fkfkhjlefj',
        amount:500,
        paymentId:'jjeedefwr',
        updatedAt:'387/344/4r'
       },
       {
        _id:2,
        orderId:'fkfkhjlefj',
        amount:500,
        paymentId:'jjeedefwr',
        updatedAt:'387/344/4r'
       },
       {
        _id:3,
        orderId:'fkfkhjlefj',
        amount:500,
        paymentId:'jjeedefwr',
        updatedAt:'387/344/4r'
       },
       {
        _id:4,
        orderId:'fkfkhjlefj',
        amount:500,
        paymentId:'jjeedefwr',
        updatedAt:'387/344/4r'
       }
    ]
    const [user,setUser]=useState<IUser| undefined>();
    const [paymentHistory,setPaymentHistory]=useState<Array<IPaymentHistory>|undefined>(paymentData)
    const [loadingData,setLoadingData]=useState<boolean>(false);
    const [loadingHistoryData,setLoadingHistoryData]=useState<boolean>(false);
    const [credentialsModal,setCredentialsModal]=useState<boolean>(false);
    const [credentialsModal2,setCredentialsModal2]=useState<boolean>(false);
    const navigate=useNavigate();
    useEffect(()=>{
        setLoadingData(true)
        setLoadingHistoryData(true)
        const accessToken= Cookies.get("AccessCookie");
      axios.get(`https://api.suryanshverma.site/api/v1/profile?token=${accessToken}`)
      .then((res)=>{
        const user=res.data.data;
        console.log(user);
        setUser(user);
        setLoadingData(false)
        axios.get(`https://api.suryanshverma.site/api/payment/history?token=${accessToken}`).then((res)=>{
            const data=res.data.data;
            console.log(data);
            setLoadingHistoryData(false)
            setPaymentHistory(data);
            
        })
        
      })
    },[])

    const handleApiModal=()=>{
      setCredentialsModal(false)
      navigate('/home')
    }

    const createApiKeys=async()=>{
        const accessToken= Cookies.get("AccessCookie");
        axios.post('https://api.suryanshverma.site/api/v1/create-api-keys',{AccessCookie:accessToken}).then((res)=>{
           const data=res.data;
           console.log(data);
           setCredentialsModal(false)
            setCredentialsModal2(true);

        }).catch((err:any)=>{
            alert(`error: ${err.message}`)
        })
    }
 return (
     <>
     <Header/>
      <div className="h-[45px]"></div>
     {
        !loadingData ? <div className="w-full flex md:flex-row flex-col md:bg-gray-400 bg-green-900">
        <div className="leftdiv md:w-[25%] w-full flex flex-col h-auto gap-3">
             <div className="leftCard1 md:mx-0 mx-5  md:ml-6  mt-5 flex flex-col  md:w-[300px] rounded-md shadow shadow-gray-500 p-4 items-center bg-white">
          
                  <div className="w-[130px] h-[130px]  rounded-full aspect-square bg-gray-300"><img src={UserImage} className=" w-full h-full rounded-full"/></div>
                  <h1 className="text-gray-700 font-semibold text-3xl my-4">{user?.name}</h1>
      
              </div>
              <div className="leftCard2  md:mx-0 mx-5 md:ml-8  flex flex-col  md:w-[300px] rounded-md shadow shadow-gray-500 p-4 items-center bg-white">
          
                 
                  <h1 className="text-gray-700 font-semibold text-md  ">Email</h1>
                  <p className=" text-green-800">{user?.email}</p>
 
      
              </div>
 
              <div className="leftCard2 md:mx-0 mx-5   md:ml-8   flex flex-col  md:w-[300px] rounded-md shadow shadow-gray-500 p-4 items-center bg-white">
          
                 
                  <h1 className="text-gray-700 font-semibold text-md  ">Payment till now</h1>
                  <p className=" text-orange-800">{user?.paymentAmount} &#x20B9;</p>
 
      
              </div>
 
              <div className="leftCard2 md:mx-0 mx-5 md:ml-8  flex flex-col  md:w-[300px] rounded-md shadow shadow-gray-500 p-4 items-center bg-white">
          <button className="bg-orange-600 p-3 text-white font-bold rounded" onClick={()=>setCredentialsModal(true)}>Create Api Keys</button>
 
 
      </div>
        </div>
        <div className="rightdiv w-full p-5">
             <div className="rounded flex flex-row flex-wrap gap-4 w-auto h-auto justify-center">
                 
                   <div className="amountCard  p-3 rounded-md shadow-md shadow-gray-700 md:w-[30%] w-[94%]  flex flex-col justify-center bg-white" >
                      <h1 className="text-3xl font-semibold text-gray-900  w-full text-center p-2"> Amount </h1>
                       <h1 className="text-3xl font-bold text-gray-200 text-center p-2 bg-green-700 rounded-md mx-12"> {user?.SCSCoins} &#x20B9; </h1>
                   </div>
 
                   <div className="amountCard  p-3 rounded-md shadow-md shadow-gray-700 md:w-[30%] w-[94%] flex flex-col justify-center bg-white" >
                      <h1 className="text-3xl font-semibold text-gray-900  w-full text-center p-2"> Payment Count </h1>
                       <h1 className="text-3xl font-bold text-gray-200 text-center p-2 bg-gray-700 rounded-md mx-12"> {user?.paymentCount} </h1>
                   </div>
 
                   <div className="amountCard  p-3 rounded-md shadow-md shadow-gray-700 md:w-[30%] w-[94%] flex flex-col justify-center bg-white" >
                      <h1 className="text-3xl font-semibold text-gray-900  w-full text-center p-2"> Services </h1>
                       <h1 className="text-3xl font-bold text-gray-200 text-center p-2 bg-orange-500 rounded-md mx-12">2 </h1>
                   </div>
 
                   <div className="amountCard  p-3 rounded-md shadow-md shadow-gray-700 w-full flex flex-col justify-center bg-gray-200 md:mx-7" >
                      <h1 className="text-3xl ml-3 font-semibold text-gray-900  w-full">Payment history </h1>
 
                    <div className="flex w-full p-2 flex-col scroll-auto">
                        {
                          !loadingHistoryData && paymentHistory && paymentHistory.map((payment)=>(
                             <div key={payment._id} className=" mx-3 my-1 rounded p-4 bg-white shadow flex justify-between md:flex-row flex-col  items-center gap-1">
                                   <h1>amount: <span className="text-green-700">{payment.amount} &#x20B9;</span></h1>
                                   <h1>orderId: <span className="text-yellow-700">{payment.orderId}</span></h1>
                                   <h1>paymentId: <span className="text-gray-700">{payment.paymentId}</span></h1>
                                   <h1>{payment.updatedAt}</h1><TiTick className="text-3xl text-gray-200 bg-green-700 rounded-full "/>
 
                              </div>
                         ))
                        }
                        {
                            !loadingHistoryData && !paymentHistory?.length==true &&  <div className=" mx-3 my-1 rounded p-4 bg-white shadow flex justify-between md:flex-row flex-col  items-center gap-1">
                                 <h1 className="text-center font-semibold text-3xl text-gray-700">No payment you have done till now</h1>
                             </div>
                         }{
                            loadingData &&  <div className="flex justify-center items-center h-[30vh] w-[90bw]">

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
                 
             </div>
        </div>
       </div>:
         <div className="flex justify-center items-center h-[90vh] w-[90bw]">

         <div
         className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
         role="status">
         <span
           className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
           >Loading...</span>
       </div>
        </div> 
     }

         <Dialog open={credentialsModal} onClose={setCredentialsModal} className="relative z-10">
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
                    Create Your Api Keys
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to create your API KEYS? If you have created api keys earlier that will be rejected. And new api keys will be working.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() =>createApiKeys()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Create API Keys
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setCredentialsModal(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <Dialog open={credentialsModal2} onClose={setCredentialsModal2} className="relative z-10">
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
                    Api Keys Created successfully
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                    Please Check your and wait till you got a email from us. We have sended your api keys through email due to security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => handleApiModal()}
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
export default Profile;