import Footer from "../components/Footer"
import Header from "../components/Header"
import HLSTranscoder from "../docs/HLSTranscoder";

const HLSTranscoderDocs=()=>{
    return (
        <>
        <Header/>
        <div className="h-[45px]"></div>
         <div className="flex justify-center">
         <div className="md:w-[94%] w-full rounded shadow shadow-gray-600 m-3 md:p-4 p-0">
         <HLSTranscoder/>
         </div>
         </div>
        <Footer/>
        </>
    )
}

export default HLSTranscoderDocs;