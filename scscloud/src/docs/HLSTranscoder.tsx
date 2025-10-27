const HLSTranscoder=()=>{
    return (
        <>
        <h1 className="text-3xl font-semibold text-gray-700 text-start">1) HLS Transcoder</h1>
       <div className="paragraph ">
          <p className="md:ml-6 ml-1">HLS transcoder is a service provided by Suryansh Cloud Service. This service is cheap as compared to other cloud providers. Use this service for your websites, Android apps or iOS apps where you want. This service transcodes your video into 1080p, 720p, 480p and 360p with HLS format. This means your video is divided into small chunks (pieces) for adaptive streaming.</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">plaintext</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`Video (1080p) → HLS Transcoder
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓               ↓
  1080p           720p            480p            360p
    ↓               ↓               ↓               ↓
[chunks]        [chunks]        [chunks]        [chunks]
    └───────────────┴───────────────┴───────────────┘
                    ↓
              master.m3u8`}
              </code>
            </pre>
          </div>
          <h2 className="font-bold text-2xl mt-6 mb-3 text-gray-700">Prerequisites</h2>
          <p className="md:ml-3 ml-1">1) <b>Active SCS Account:</b> You must be registered and authenticated</p>
          <p className="md:ml-3 ml-1">2) <b>Object Storage Service:</b> Must be enabled and configured for your account</p>
          <p className="md:ml-3 ml-1">3) <b>Sufficient Balance:</b> SCS Coins ≥ (Video Size in MB × Cost per MB)</p>
          <p className="md:ml-3 ml-1">4) <b>Object Storage Bucket:</b> Create a bucket where transcoded videos will be stored</p>
          
          <h2 className="font-bold text-2xl mt-6 mb-3 text-gray-700">How to Use HLS Transcoder</h2>
          <p className="md:ml-3 ml-1">1) Ensure you have Object Storage Service enabled in your SCS account</p>
          <p className="md:ml-3 ml-1">2) Create an Object Storage bucket for storing transcoded videos</p>
          <p className="md:ml-3 ml-1">3) Open SCS console and navigate to Services section</p>
          <p className="md:ml-3 ml-1">4) Click on HLS Transcoder - the HLS Transcoder console will open</p>
          <p className="md:ml-3 ml-1">5) Select your video file (MP4 format recommended)</p>
          <p className="md:ml-3 ml-1">6) Enter your Object Storage bucket name where transcoded files will be saved</p>
          <p className="md:ml-3 ml-1">7) Click "Transcode video" - you'll receive an email notification when complete</p>

          <h1 className="font-bold text-3xl m-3 text-gray-700">SCS-HLS-Transcoder SDK Node.js</h1>
          <p>Installing SDK</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">bash</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`npm install scs-hls-transcoder`}
              </code>
            </pre>
          </div>
          <p>common js import</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`const { VideoUploadUrl, TranscodingVideo } = require('scs-hls-transcoder');`}
              </code>
            </pre>
          </div>
          <p>module import</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`import { VideoUploadUrl, TranscodingVideo } from 'scs-hls-transcoder';`}
              </code>
            </pre>
          </div>
          <p>VideoUploadUrl:- returns response object with properties <b>uploadUrl, videoKey, email</b></p>
          <p className='ml-4'>Upload your video to this URL using the PUT method</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`const response = await VideoUploadUrl({
  AccessCookie: 'your-access-token',
  fileName: 'video.mp4',
  videoSizeInMB: 150,
  bucketName: 'your-object-storage-bucket'
});

// response object:
// {
//   uploadUrl: "https://s3.amazonaws.com/...",
//   videoKey: "outputs/video.mp4",
//   email: "user@example.com"
// }

// Upload video using PUT method
await fetch(response.uploadUrl, {
  method: 'PUT',
  body: videoFile,
  headers: {
    'Content-Type': 'video/mp4'
  }
});`}
              </code>
            </pre>
          </div>
          <p>TranscodingVideo:- Initiates the HLS transcoding process. Returns response object with <b>statusCode, message</b></p>
          <p className='ml-4'>Note: Transcoded videos will be stored in your Object Storage bucket. You'll receive an email notification when transcoding completes.</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`const transcodingResponse = await TranscodingVideo({
  AccessCookie: 'your-access-token',
  videoKey: response.videoKey,
  bucketPath: '', // Optional: subfolder path
  userBucketName: 'your-object-storage-bucket',
  email: response.email,
  videoSizeInMB: 150
});

// response object:
// {
//   statusCode: 200,
//   message: "transcoding process is queued. when transcoding completes we will notify through email"
// }`}
              </code>
            </pre>
          </div>

          <h2 className="font-bold text-2xl mt-6 mb-3 text-gray-700">Complete Workflow Example</h2>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`// Step 1: Get upload URL
const uploadRes = await VideoUploadUrl({
  AccessCookie: token,
  fileName: 'my-video.mp4',
  videoSizeInMB: 150,
  bucketName: 'my-object-storage-bucket'
});

// Step 2: Upload video to pre-signed URL
await fetch(uploadRes.uploadUrl, {
  method: 'PUT',
  body: videoFile,
  headers: { 'Content-Type': 'video/mp4' }
});

// Step 3: Start transcoding
const transcodeRes = await TranscodingVideo({
  AccessCookie: token,
  videoKey: uploadRes.videoKey,
  bucketPath: '',
  userBucketName: 'my-object-storage-bucket',
  email: uploadRes.email,
  videoSizeInMB: 150
});

console.log(transcodeRes.message);
// Output: "transcoding process is queued. when transcoding completes we will notify through email"`}
              </code>
            </pre>
          </div>

          <h2 className="font-bold text-2xl mt-6 mb-3 text-gray-700">Authentication Methods</h2>
          <p>The API supports two authentication methods:</p>
          <p className="md:ml-3 ml-1"><b>1. AccessCookie:</b> JWT token-based authentication (recommended for web apps)</p>
          <p className="md:ml-3 ml-1"><b>2. Credentials:</b> Access Key and Secret Access Key authentication (for programmatic access)</p>
          
          <h2 className="font-bold text-2xl mt-6 mb-3 text-gray-700">Important Notes</h2>
          <p className="md:ml-3 ml-1">• Transcoded videos are stored in your <b>Object Storage bucket</b>, not AWS S3</p>
          <p className="md:ml-3 ml-1">• You must have Object Storage Service enabled and configured</p>
          <p className="md:ml-3 ml-1">• Cost is calculated as: Video Size (MB) × Cost per MB</p>
          <p className="md:ml-3 ml-1">• Supported input format: MP4 (other formats may be supported)</p>
          <p className="md:ml-3 ml-1">• Output format: HLS (.m3u8 playlist + .ts segments)</p>
          <p className="md:ml-3 ml-1">• Email notification sent when transcoding completes</p>

       </div>
        </>
    )
}
export default HLSTranscoder;