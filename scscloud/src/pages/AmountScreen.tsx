import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import {cashfree }from "../utils/PaymentService.config";
import { useNavigate } from "react-router-dom";

const AmountScreen:React.FC=()=>{
    const [paymentInputBox,setPaymentInputBox]=useState<boolean>(false);
    const [inputAmount,setInputAmount]=useState<number|undefined>();
    const [phoneNumber,setPhoneNumber]=useState<Number|undefined>();
    const [scsCoins,setScsCoins]=useState<Number|undefined>();
    const [loadingData,setLoadingData]=useState<boolean>(false);
    const navigate=useNavigate();

     useEffect(()=>{
      setLoadingData(true)
      const accessToken= Cookies.get("AccessCookie");
       axios.get(`https://api.suryanshverma.site/api/v1/scs-coins?token=${accessToken}`).then((res)=>{
        setScsCoins(res.data.data.scsCoins);
        setLoadingData(false);
       })
     },[])
    const handlePayment=()=>{
      if(!phoneNumber && !inputAmount){
        return alert('Enter all required fields')
      }
      const accessToken= Cookies.get("AccessCookie");
      let orderId='';
      
      
      
       
        axios.post('https://api.suryanshverma.site/api/payment/create-order',{AccessCookie:accessToken,paymentAmount:inputAmount,phoneNumber}).then((res)=>{
          const data=res.data.data;
          console.log(data);
          const paymentSessionId=data.payment_session_id;
          orderId=data.order_id;
             let checkoutOptions = {
          paymentSessionId,
          redirectTarget: "_modal"
      }
      cashfree.checkout(checkoutOptions).then(()=>{
        axios.post('https://api.suryanshverma.site/api/payment/verify-payment',{AccessCookie:accessToken,orderId}).then((res)=>{
          alert(res.data.message);
          navigate('/home');
        })
      })
        })


    }
    return (
         <>
         <Header/>
         <div className="w-full h-[45px]"></div>
         {
          !loadingData ?<>
           <div className="w-full flex justify-center mx-3">  <h1 className="text-3xl font-bold text-gray-900 border-solid border-b-2 border-gray-400 w-[32%] inline text-center p-2 w-auto"> Payment Dashboard </h1></div>
          <div className="w-full flex-1 items-center flex flex-col h-[90vh]">
          <div className="card p-3 rounded-md shadow-md shadow-gray-700 md:w-[30%] w-[94%] m-4 flex flex-col justify-center bg-blue-100" >
          <h1 className="text-3xl font-semibold text-gray-900  w-full text-center p-2"> Amount </h1>
          <h1 className="text-3xl font-bold text-cyan-950 text-center p-2 bg-cyan-400 rounded-md mx-12"> {String(scsCoins)} &#x20B9; </h1>
          <button className=" bg-gray-600 m-4 p-3 text-gray-200 rounded-md font-bold mx-12" onClick={()=>setPaymentInputBox(true)}>Add Amount</button>
          </div>
         {
             paymentInputBox &&  <div className="addAmount w-full flex flex-col items-center duration-300">
             <input type="number" placeholder="Enter amount(In Rupees)..." className="md:p-2 p-3 md:w-[30%] w-[94%] border-solid border-gray-400 border-[1.5px] rounded-md m-5" value={inputAmount} onChange={(e)=>setInputAmount(parseInt(e.target.value))} />
             <input type="number" placeholder="Enter Your Phone Number(required)" className="md:p-2 p-3 md:w-[30%] w-[94%] border-solid border-gray-400 border-[1.5px] rounded-md m-5" onChange={(e)=>setPhoneNumber(parseInt(e.target.value))} />
             <button className="bg-gray-600 rounded-md md:p-2 md:px-3 p-3 text-gray-200 font-bold md:w-[30%] w-[94%] text-xl" onClick={handlePayment}>Pay</button>
             <button className="bg-cyan-400 rounded-md p-2 px-3 text-cyan-900  font-bold md:w-[30%] w-[94%] text-xl my-3" onClick={()=>setPaymentInputBox(false)}>Cancel Pay</button>
           </div>
         }
 
          </div>
          </>:
         <div className="flex justify-center items-center h-[80vh] w-[90bw]">

          <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
         </div>

         }

         <Footer/>
         </>
    )
}
export default AmountScreen;