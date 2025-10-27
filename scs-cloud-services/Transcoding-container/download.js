import { exec } from "child_process";
import path from "path"
import fs from "fs"
import 'dotenv/config'
import { S3Client, GetObjectCommand,PutObjectCommand,DeleteObjectCommand  } from "@aws-sdk/client-s3"
import {Queue} from 'bullmq'

const queue = new Queue('TranscodingQueue',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:Number(process.env.QUEUE_PORT),
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
});

const s3Client = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT,
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});



const bucketName=process.env.BUCKET_NAME;
const videoKey=process.env.VIDEO_KEY;
const bucketPath=process.env.BUCKET_PATH;
const email=process.env.USER_EMAIL;


const deleteObject=async(videoKey)=>{
  queue.add('transcoding-email'+Date.now(),JSON.stringify({email,videoKey}))
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: videoKey    
})

await s3Client.send(command);
console.log('transcoding success');
process.exit(0);
}

const putObj=async(videoKey)=>{
  const distFolderPath =  'outputs';
  const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

  for (const file of distFolderContents) {
    const filePath = path.join(distFolderPath, file)

    if (fs.lstatSync(filePath).isDirectory()) continue;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${bucketPath}/${videoKey}/${file}`,
        Body: fs.createReadStream(filePath),
    })

    await s3Client.send(command)
    console.log('uploaded', filePath)
}
deleteObject(videoKey);
}

const getObject = async (videoKey) => {
  const getobjcmd = new GetObjectCommand({
    Bucket: bucketName,
    Key: videoKey,
  });
  const resp = await s3Client.send(getobjcmd);
  const stream = await resp.Body.transformToWebStream();
  // derive a safe filename from the S3 key and validate it
  const filepp = path.basename(videoKey || '');
  if (!filepp) {
    console.error('Invalid or missing videoKey, cannot determine filename. videoKey=', videoKey);
    process.exit(1);
  }

  // ensure output folders exist before starting transcoding/upload
  const ensureDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
  ensureDir('outputs');
  ['1080p', '720p', '480p', '360p'].forEach(dir => ensureDir(path.join('outputs', dir)));

  const fileStream = fs.createWriteStream(filepp);

  stream.pipeTo(new WritableStream({
    write(chunk) {
        fileStream.write(Buffer.from(chunk));
    },
    close() {
        fileStream.end();
        console.log("File downloaded successfully.");
        const p=exec(`ffmpeg -i ${filepp} -codec:v libx264 -vf "scale=-2:1080" -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename outputs/1080p/segment%03d.ts -start_number 0 outputs/1080p/index.m3u8 && ffmpeg -i ${filepp} -codec:v libx264 -vf "scale=-2:720" -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename outputs/720p/segment%03d.ts -start_number 0 outputs/720p/index.m3u8 && ffmpeg -i ${filepp} -codec:v libx264 -vf "scale=-2:480" -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename outputs/480p/segment%03d.ts -start_number 0 outputs/480p/index.m3u8 && ffmpeg -i ${filepp} -codec:v libx264 -vf "scale=-2:360" -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename outputs/360p/segment%03d.ts -start_number 0 outputs/360p/index.m3u8
          `);
          
          // capture stdout/stderr
          if (p.stdout) p.stdout.on('data', (data) => console.log(data.toString()));
          if (p.stderr) p.stderr.on('data', (data) => console.error(data.toString()));

          p.on('error', (err) => {
            console.error('ffmpeg spawn error', err);
            process.exit(1);
          });

          p.on('close', async (code, signal) => {
            if (code === 0) {
              console.log('transcoding completed');
              await putObj(videoKey);
              console.log('completed');
            } else {
              console.error('ffmpeg exited with code', code, 'signal', signal);
              process.exit(1);
            }
          });
          
    },
    abort(err) {
        console.error("Error writing file", err);
    }
}))

  
};
getObject(videoKey);