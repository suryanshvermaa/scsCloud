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

   const paymentData: IPaymentHistory[] = []
   const [user,setUser]=useState<IUser| undefined>();
   const [paymentHistory,setPaymentHistory]=useState<Array<IPaymentHistory>>(paymentData)
    const [loadingData,setLoadingData]=useState<boolean>(false);
    const [loadingHistoryData,setLoadingHistoryData]=useState<boolean>(false);
    const [credentialsModal,setCredentialsModal]=useState<boolean>(false);
    const [credentialsModal2,setCredentialsModal2]=useState<boolean>(false);
    const navigate=useNavigate();
    useEffect(()=>{
      async function load() {
        try {
          setLoadingData(true)
          setLoadingHistoryData(true)
          let accessToken = Cookies.get("AccessCookie");
          if (!accessToken) {
            const refreshToken = Cookies.get("RefreshCookie");
            if (refreshToken) {
              const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/refresh-token`, { refreshToken });
              if (res?.data?.data?.cookies) {
                const date1=new Date(); date1.setHours(date1.getHours()+1)
                const date2=new Date(); date2.setHours(date2.getHours()+12)
                Cookies.set("AccessCookie", res.data.data.cookies[0].value, {expires:date1})
                Cookies.set("RefreshCookie", res.data.data.cookies[1].value, {expires:date2})
                accessToken = res.data.data.cookies[0].value;
              }
            }
          }

          if (!accessToken) {
            navigate('/login');
            return;
          }

          const { data: profileRes } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/profile?token=${accessToken}`);
          setUser(profileRes.data);
          setLoadingData(false);

          try {
            const { data: historyRes } = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/history?token=${accessToken}`);
            const maybeArr = (historyRes as any)?.data;
            setPaymentHistory(Array.isArray(maybeArr) ? maybeArr : []);
          } catch (e) {
            // history may fail independently; keep UI usable
          } finally {
            setLoadingHistoryData(false);
          }
        } catch (e:any) {
          setLoadingData(false);
          setLoadingHistoryData(false);
          navigate('/login');
        }
      }
      load();
    },[])

    const handleApiModal=()=>{
      setCredentialsModal(false)
      navigate('/home')
    }

    const createApiKeys=async()=>{
        const accessToken= Cookies.get("AccessCookie");
      axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create-api-keys`,{AccessCookie:accessToken}).then((res)=>{
        const data=res.data.data;
           console.log(data);
           setCredentialsModal(false)
            setCredentialsModal2(true);

        }).catch((err:any)=>{
            alert(`error: ${err.message}`)
        })
    }
 return (
   <>
     {
       !loadingData ? (
         <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left column */}
             <div className="space-y-4">
               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col items-center">
                 <div className="w-[120px] h-[120px] rounded-full overflow-hidden ring-1 ring-white/10">
                   <img src={UserImage} className="w-full h-full object-cover" />
                 </div>
                 <h1 className="text-xl font-semibold mt-4 text-white">{user?.name}</h1>
               </div>
               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                 <h2 className="text-sm font-semibold text-slate-200">Email</h2>
                 <p className="mt-1 text-sm text-cyan-300 break-all">{user?.email}</p>
               </div>
               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                 <h2 className="text-sm font-semibold text-slate-200">Payment till now</h2>
                 <p className="mt-1 text-lg text-amber-300">{user?.paymentAmount} ₹</p>
               </div>
               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                 <button className="w-full rounded-md bg-amber-500/90 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-2 text-sm" onClick={()=>setCredentialsModal(true)}>
                   Create API Keys
                 </button>
               </div>
             </div>

             {/* Right column */}
             <div className="md:col-span-2 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                   <h3 className="text-sm text-slate-300">Amount</h3>
                   <div className="mt-2 text-2xl font-bold text-emerald-300">{user?.SCSCoins} ₹</div>
                 </div>
                 <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                   <h3 className="text-sm text-slate-300">Payment Count</h3>
                   <div className="mt-2 text-2xl font-bold text-slate-200">{user?.paymentCount}</div>
                 </div>
                 <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                   <h3 className="text-sm text-slate-300">Services</h3>
                   <div className="mt-2 text-2xl font-bold text-amber-300">2</div>
                 </div>
               </div>

               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                 <h3 className="text-base font-semibold text-white">Payment history</h3>
                 <div className="mt-4 space-y-3">
                   {(!loadingHistoryData && Array.isArray(paymentHistory)) && paymentHistory.map((payment)=> (
                     <div key={payment._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                       <h1>amount: <span className="text-emerald-300">{payment.amount} ₹</span></h1>
                       <h1>orderId: <span className="text-amber-300">{payment.orderId}</span></h1>
                       <h1>paymentId: <span className="text-slate-300">{payment.paymentId}</span></h1>
                       <h1 className="text-slate-400 text-sm">{payment.updatedAt}</h1>
                       <TiTick className="text-2xl text-white bg-emerald-600 rounded-full"/>
                     </div>
                   ))}

                   {(!loadingHistoryData && (!paymentHistory || paymentHistory.length === 0)) && (
                     <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center text-slate-300">
                       No payment you have done till now
                     </div>
                   )}

                   {(loadingHistoryData || loadingData) && (
                     <div className="flex justify-center items-center h-[20vh]">
                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-white" role="status"/>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       ) : (
         <div className="flex justify-center items-center h-[60vh]">
           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-white" role="status"/>
         </div>
       )
     }

         <Dialog open={credentialsModal} onClose={setCredentialsModal} className="relative z-50">
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

  <Dialog open={credentialsModal2} onClose={setCredentialsModal2} className="relative z-50">
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
   </>
 )
}
export default Profile;