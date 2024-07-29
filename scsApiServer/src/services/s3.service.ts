import { S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import 'dotenv/config';

const myBucketName=process.env.MY_BUCKET_NAME;

const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey:process.env.SECRET_ACCESS_KEY!
},
});

export const putObjectSignedUrl=async(fileName:string)=>{
  
    const command= new PutObjectCommand({
        Bucket:myBucketName,
        Key:`outputs/${fileName}`
      })
      
      const url=await getSignedUrl(s3client,command,{expiresIn:3600})
      
      return url;
}