import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.MY_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_SECRET_ACCESS_KEY
    }
})
const myBucket=process.env.MY_BUCKET_NAME;
const webUrl=process.env.WEB_URL;
const pathBucket=webUrl;

async function build() {
    console.log('Executing index.js');
    const outDirPath = path.join('output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
    })

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
    })

    p.on('close', async function () {
        console.log('Build Complete')
        const distFolderPath = path.join('output', 'dist')
        const distFolderfiles = fs.readdirSync(distFolderPath, { recursive: true })

        // publishLog(`Starting to upload`)
        for (const file of distFolderfiles) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)

            const command = new PutObjectCommand({
                Bucket: myBucket ,
                Key: `hosted-websites/${pathBucket}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            console.log('uploaded', filePath)
        }
        console.log('Done...')
        process.exit(1);
    })
}

build();