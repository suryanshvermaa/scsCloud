import axios from 'axios';

const API_BASE_URL='https://api.suryanshverma.live/api/v1';

const errorObj={error:'Invalid credentials or not sufficient amount or error fileName'};

/**
 * 
 * @param {{fileName:string; credentials:{accessKey:string; secretAccessKey:string}}} video 
 * @returns 
 */
export const VideoUploadUrl=async(video)=>{
    try {
       const res=await axios.post(`${API_BASE_URL}/upload-video`,{fileName:video.fileName,credentials:video.credentials})
       const responseObj={
        uploadUrl:res.data.uploadUrl,
        fileName:res.data.fileName
        }
       return responseObj;
    } catch (error) {
        return errorObj;
    }
}
/**
 * 
 * @param {{fileName:string; awsCredentials:{accessKey:string; secretAccessKey:string;} bucketPath:string; bucketName:string; email:string; credentials:{ accessKey:string; secretAccessKey:string; }}} transcodingProps 
 * @returns 
 */
export const TranscodeVideo=async(transcodingProps)=>{
     try {
        const transcodingPropsObj={
            videoKey:`outputs/${transcodingProps.fileName}`,
            userAccessKey:transcodingProps.awsCredentials.accessKey,
            userSecretAccessKey:transcodingProps.awsCredentials.secretAccessKey,
            bucketPath:transcodingProps.bucketPath,
            userBucketName:transcodingProps.bucketName,
            email:transcodingProps.email,
            credentials:transcodingProps.credentials

        }
       const res=await axios.post(`${API_BASE_URL}/transcoding-video`,{transcodingPropsObj})
       const resP= {
                success:true,
                message:'transcoding process is queued. when transcoding completes we will notify through email',
                videoPath:`https://s3.${transcodingProps.bucketName}.amazonaws.com/${transcodingProps.bucketPath}/outputs/master.m3u8`
        }
        return resP;
     } catch (error) {
        const errorP={error:'Invalid credentials or not sufficient amount or error fileName'}
        return   errorP;
     }
}