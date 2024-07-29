import HLSImage from '../assets/hlsTrascoder.png';
import InstallSDKImage from '../assets/SCSPackage.png';
import RequireSCSImage from '../assets/RequireSCS.png';
import ImportSCSImage from '../assets/ImportSCS.png';
import VideoUploadUrlImage from '../assets/VideoUploadUrl.png';
import TranscodeVideoImage from '../assets/TranscodeVideo.png';

const HLSTranscoder=()=>{
    return (
        <>
        <h1 className="text-3xl font-semibold text-gray-700 text-start">1) HLS Transcoder</h1>
       <div className="paragraph ">
          <p className="md:ml-6 ml-1">HLS transcoder is a service provided by suryansh cloud service.This service is cheap as compared to other cloud providers. Use service to your websites, Android apps or IOS apps where you want.This service transcode your video into 1080p 720p 480p and 360p with HLS. this means your video is divided into small chunks(pieces). </p>
          <div className='rounded shadow shadow-gray-600 p-3 my-4'>
          <img src={HLSImage} alt="hlstranscoderImage" className="my-6"/>
          </div>
          <p>There are some steps to use this service:-</p>
          <p className="md:ml-3 ml-1">1) Create an IAM User on aws and give permission to your bucket putObject permission. </p>
          <p className="md:ml-3 ml-1">2) Save your credentials like accessKey and secretAccessKey.</p>
          <p className="md:ml-3 ml-1">3) Open SCS console</p>
          <p className="md:ml-3 ml-1">4) In Services section click on HLS Transcoder HLS Trascoder console will be open</p>
          <p className="md:ml-3 ml-1">5) Select video of 1080p</p>
          <p className="md:ml-3 ml-1">6) Fill all required fields including accessKey and secretAccessKey because we need your bucket read permission so we HLS transcoder service can upload files to your s3 bucket</p>

          <h1 className="font-bold text-3xl m-3 text-gray-700">SCS-HLS-Transcoder SDK Node js</h1>
          <p>Insatlling SDK</p>
          <div className='rounded shadow shadow-gray-600 p-1 my-4'>
          <img src={InstallSDKImage} alt="InstallSDKImage" className="my-6"/>
          </div>
          <p>common js import</p>
          <div className='rounded shadow shadow-gray-600 p-1 my-4'>
          <img src={RequireSCSImage} alt="RequireSCSImage" className="my-6"/>
          </div>
          <p>module import</p>
          <div className='rounded shadow shadow-gray-600 p-1 my-4'>
          <img src={ImportSCSImage} alt="ImportSCSImage" className="my-6"/>
          </div>
          <p>VideoUploadUrl:- returns response object <b>uploadUrl , fileName</b></p>
          <p className='ml-4'>Upload Your Video to this url using put method</p>
          <div className='rounded shadow shadow-gray-600 p-1 my-4'>
          <img src={VideoUploadUrlImage} alt="VideoUploadUrlImage" className="my-6"/>
          </div>
          <p>TranscodingVideo:- returns response object with properties <b> success, message,videoPath</b></p>
          <div className='rounded shadow shadow-gray-600 p-1 my-4'>
          <img src={TranscodeVideoImage} alt="TranscodeVideoImage" className="my-6"/>
          </div>

       </div>
        </>
    )
}
export default HLSTranscoder;