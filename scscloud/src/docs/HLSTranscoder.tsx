const HLSTranscoder=()=>{
    return (
        <>
        <h1 className="text-3xl font-semibold text-gray-700 text-start">1) HLS Transcoder</h1>
       <div className="paragraph ">
          <p className="md:ml-6 ml-1">HLS transcoder is a service provided by suryansh cloud service.This service is cheap as compared to other cloud providers. Use service to your websites, Android apps or IOS apps where you want.This service transcode your video into 1080p 720p 480p and 360p with HLS. this means your video is divided into small chunks(pieces). </p>
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
          <p>There are some steps to use this service:-</p>
          <p className="md:ml-3 ml-1">1) Create an IAM User on aws and give permission to your bucket putObject permission. </p>
          <p className="md:ml-3 ml-1">2) Save your credentials like accessKey and secretAccessKey.</p>
          <p className="md:ml-3 ml-1">3) Open SCS console</p>
          <p className="md:ml-3 ml-1">4) In Services section click on HLS Transcoder HLS Trascoder console will be open</p>
          <p className="md:ml-3 ml-1">5) Select video of 1080p</p>
          <p className="md:ml-3 ml-1">6) Fill all required fields including accessKey and secretAccessKey because we need your bucket read permission so we HLS transcoder service can upload files to your s3 bucket</p>

          <h1 className="font-bold text-3xl m-3 text-gray-700">SCS-HLS-Transcoder SDK Node js</h1>
          <p>Insatlling SDK</p>
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
          <p>VideoUploadUrl:- returns response object <b>uploadUrl , fileName</b></p>
          <p className='ml-4'>Upload Your Video to this url using put method</p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`const response = await VideoUploadUrl(apiKey);

// response object:
// {
//   uploadUrl: "https://s3.amazonaws.com/...",
//   fileName: "video-12345.mp4"
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
          <p>TranscodingVideo:- returns response object with properties <b> success, message,videoPath</b></p>
          <div className='rounded-md border border-gray-300 my-4 bg-white'>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">javascript</div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
              <code className="text-sm font-mono leading-relaxed">
{`const transcodingResponse = await TranscodingVideo({
  apiKey: 'your-api-key',
  fileName: response.fileName,
  bucketName: 'your-s3-bucket',
  accessKey: 'your-aws-access-key',
  secretAccessKey: 'your-aws-secret-key',
  region: 'us-east-1'
});

// response object:
// {
//   success: true,
//   message: "Video transcoding started",
//   videoPath: "https://your-bucket.s3.amazonaws.com/path/master.m3u8"
// }`}
              </code>
            </pre>
          </div>

       </div>
        </>
    )
}
export default HLSTranscoder;