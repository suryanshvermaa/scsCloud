import UserImage from '../assets/user.jpg';
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { notifier } from "../utils/notifier";
import { 
  Mail, 
  Wallet, 
  CreditCard, 
  Key, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Copy,
  Edit,
  Settings,
  Activity,
  DollarSign
} from 'lucide-react';

const Profile:React.FC=()=>{
    interface IUser{
       email:string;
       name:string;
       SCSCoins:number;
       __v:number;
       updatedAt:Date;
       paymentCount:number;
       paymentAmount:number;
       objectStorageServiceEnabled?: boolean;
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
          setUser(profileRes.data.data);
          setLoadingData(false);

          try {
            const { data: historyRes } = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/history?token=${accessToken}`);
            const maybeArr = (historyRes as any)?.data.data;
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
            notifier.error(`error: ${err.message}`)
        })
    }
 return (
   <>
     {
       !loadingData ? (
         <div className="max-w-7xl mx-auto px-6 py-8">
           {/* Header */}
           <div className="mb-8">
             <h1 className="text-3xl font-bold text-foreground mb-2">Account Profile</h1>
             <p className="text-muted-foreground">Manage your account information and settings</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Left Sidebar - Profile Card */}
             <div className="lg:col-span-4 space-y-6">
               {/* Profile Picture & Name */}
               <div className="rounded-xl border border-border bg-card p-6">
                 <div className="flex flex-col items-center">
                   <div className="relative group">
                     <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20">
                       <img src={UserImage} alt={user?.name} className="w-full h-full object-cover" />
                     </div>
                     <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                       <Edit className="h-4 w-4" />
                     </button>
                   </div>
                   <h2 className="text-2xl font-bold text-foreground mt-4">{user?.name}</h2>
                   <p className="text-sm text-muted-foreground mt-1">SCS Cloud Member</p>
                   
                   <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                     <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                     <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Verified Account</span>
                   </div>
                 </div>

                 <div className="mt-6 pt-6 border-t border-border space-y-3">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-primary/10">
                       <Mail className="h-4 w-4 text-primary" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs text-muted-foreground">Email</p>
                       <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-accent/10">
                       <Calendar className="h-4 w-4 text-accent" />
                     </div>
                     <div className="flex-1">
                       <p className="text-xs text-muted-foreground">Member Since</p>
                       <p className="text-sm font-medium text-foreground">
                         {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                       </p>
                     </div>
                   </div>
                 </div>

                 <button 
                   onClick={() => navigate('/amount-dashboard')}
                   className="w-full mt-6 flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-accent transition-colors font-medium"
                 >
                   <Wallet className="h-4 w-4" />
                   Go to Billing
                 </button>
               </div>

               {/* Quick Stats */}
               <div className="rounded-xl border border-border bg-card p-6">
                 <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                   <Activity className="h-4 w-4 text-primary" />
                   Quick Stats
                 </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                     <span className="text-sm text-muted-foreground">Active Services</span>
                     <span className="text-lg font-bold text-primary">
                       {(user?.objectStorageServiceEnabled ? 1 : 0) + 2}
                     </span>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                     <span className="text-sm text-muted-foreground">API Keys</span>
                     <span className="text-lg font-bold text-accent">1</span>
                   </div>
                 </div>
               </div>

               {/* API Keys Card */}
               <div className="rounded-xl border border-border bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-lg bg-amber-500/20">
                     <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
                     <p className="text-xs text-muted-foreground">Access your services programmatically</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => setCredentialsModal(true)}
                   className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium text-sm transition-colors"
                 >
                   <Key className="h-4 w-4" />
                   Generate API Keys
                 </button>
               </div>
             </div>

             {/* Right Content */}
             <div className="lg:col-span-8 space-y-6">
               {/* Account Overview Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-5">
                   <div className="flex items-center justify-between mb-2">
                     <div className="p-2 rounded-lg bg-emerald-500/20">
                       <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                   </div>
                   <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                   <p className="text-3xl font-bold text-foreground">₹{(user?.SCSCoins ?? 0).toFixed(2)}</p>
                   <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Available to spend</p>
                 </div>

                 <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-5">
                   <div className="flex items-center justify-between mb-2">
                     <div className="p-2 rounded-lg bg-primary/20">
                       <CreditCard className="h-5 w-5 text-primary" />
                     </div>
                   </div>
                   <p className="text-sm text-muted-foreground mb-1">Total Payments</p>
                   <p className="text-3xl font-bold text-foreground">{user?.paymentCount || 0}</p>
                   <p className="text-xs text-muted-foreground mt-2">Transactions made</p>
                 </div>

                 <div className="rounded-xl border border-border bg-gradient-to-br from-accent/10 to-accent/5 p-5">
                   <div className="flex items-center justify-between mb-2">
                     <div className="p-2 rounded-lg bg-accent/20">
                       <TrendingUp className="h-5 w-5 text-accent" />
                     </div>
                   </div>
                   <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                   <p className="text-3xl font-bold text-foreground">₹{user?.paymentAmount || 0}</p>
                   <p className="text-xs text-muted-foreground mt-2">Lifetime spending</p>
                 </div>
               </div>

               {/* Account Actions */}
               <div className="rounded-xl border border-border bg-card p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                   <Settings className="h-5 w-5 text-primary" />
                   Quick Actions
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <button 
                     onClick={() => navigate('/hosting-service')}
                     className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-left"
                   >
                     <div className="p-2 rounded-lg bg-primary/10">
                       <Activity className="h-5 w-5 text-primary" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Hosting Service</p>
                       <p className="text-xs text-muted-foreground">Manage your websites</p>
                     </div>
                   </button>

                   <button 
                     onClick={() => navigate('/hls-transcoding-service')}
                     className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-left"
                   >
                     <div className="p-2 rounded-lg bg-accent/10">
                       <Activity className="h-5 w-5 text-accent" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">HLS Transcoding</p>
                       <p className="text-xs text-muted-foreground">Transcode videos</p>
                     </div>
                   </button>

                   <button 
                     onClick={() => navigate('/object-storage')}
                     className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-left"
                   >
                     <div className="p-2 rounded-lg bg-purple-500/10">
                       <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Object Storage</p>
                       <p className="text-xs text-muted-foreground">S3-compatible storage</p>
                     </div>
                   </button>

                   <button 
                     onClick={() => navigate('/container-service')}
                     className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-left"
                   >
                     <div className="p-2 rounded-lg bg-sky-500/10">
                       <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Container Service</p>
                       <p className="text-xs text-muted-foreground">Deploy containers</p>
                     </div>
                   </button>

                   <button 
                     onClick={() => navigate('/amount-dashboard')}
                     className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-left"
                   >
                     <div className="p-2 rounded-lg bg-emerald-500/10">
                       <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Billing Dashboard</p>
                       <p className="text-xs text-muted-foreground">View payments</p>
                     </div>
                   </button>
                 </div>
               </div>

               {/* Payment History */}
               <div className="rounded-xl border border-border bg-card p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                     <Clock className="h-5 w-5 text-primary" />
                     Recent Transactions
                   </h3>
                   <button 
                     onClick={() => navigate('/amount-dashboard')}
                     className="text-sm text-primary hover:text-accent transition-colors"
                   >
                     View All →
                   </button>
                 </div>

                 <div className="space-y-3">
                   {(!loadingHistoryData && Array.isArray(paymentHistory) && paymentHistory.length > 0) ? (
                     paymentHistory.slice(0, 5).map((payment) => (
                       <div 
                         key={payment._id} 
                         className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                       >
                         <div className="flex items-center gap-4">
                           <div className="p-2 rounded-full bg-emerald-500/10">
                             <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                           </div>
                           <div>
                             <p className="font-medium text-foreground">Payment Received</p>
                             <div className="flex items-center gap-2 mt-1">
                               <p className="text-xs text-muted-foreground">Order: {payment.orderId}</p>
                               <button className="text-muted-foreground hover:text-foreground transition-colors">
                                 <Copy className="h-3 w-3" />
                               </button>
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{payment.amount}</p>
                           <p className="text-xs text-muted-foreground mt-1">
                             {new Date(payment.updatedAt).toLocaleDateString()}
                           </p>
                         </div>
                       </div>
                     ))
                   ) : (!loadingHistoryData && (
                     <div className="text-center py-12">
                       <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                         <DollarSign className="h-8 w-8 text-muted-foreground" />
                       </div>
                       <p className="text-muted-foreground mb-4">No transactions yet</p>
                       <button
                         onClick={() => navigate('/amount-dashboard')}
                         className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
                       >
                         Make your first payment →
                       </button>
                     </div>
                   ))}

                   {(loadingHistoryData || loadingData) && (
                     <div className="flex justify-center items-center h-[20vh]">
                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent" role="status">
                         <span className="sr-only">Loading...</span>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       ) : (
         <div className="flex justify-center items-center min-h-[80vh]">
           <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent" role="status">
             <span className="sr-only">Loading...</span>
           </div>
         </div>
       )
     }

         <Dialog open={credentialsModal} onClose={setCredentialsModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-xl bg-card border border-border text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                    <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold text-foreground mb-2">
                    Generate API Keys
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Creating new API keys will invalidate your previous keys. The new credentials will be sent to your registered email for security purposes.
                  </p>
                  
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900 dark:text-amber-200">
                        <strong>Important:</strong> Old API keys will stop working immediately after new ones are generated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setCredentialsModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createApiKeys}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors"
              >
                Generate Keys
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <Dialog open={credentialsModal2} onClose={setCredentialsModal2} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-xl bg-card border border-border text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold text-foreground mb-2">
                    API Keys Generated Successfully
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Your new API keys have been created and sent to your registered email address. Please check your inbox (and spam folder) for the credentials.
                  </p>
                  
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-foreground">
                      <strong>Security Tip:</strong> Store your API keys securely and never share them publicly. Use environment variables in your applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={handleApiModal}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent transition-colors font-medium"
              >
                Got it, thanks!
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