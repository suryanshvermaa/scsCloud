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
    const outDirPath = path.join(process.cwd(), 'output')

    // Validate environment variables
    if (!process.env.MY_ACCESS_KEY_ID || !process.env.MY_SECRET_ACCESS_KEY || !myBucket) {
        console.error('Missing AWS environment variables (MY_ACCESS_KEY_ID, MY_SECRET_ACCESS_KEY or MY_BUCKET_NAME). Uploads will fail.')
    }

    // If `output` doesn't exist, try running build in the current directory and log a warning.
    const buildCmd = fs.existsSync(outDirPath)
        ? `cd "${outDirPath}" && npm install && npm run build`
        : `npm install && npm run build`

    console.log('Running build command:', buildCmd)

    const p = exec(buildCmd)

    p.stdout.on('data', function (data) {
        process.stdout.write(data.toString())
    })

    p.stderr.on('data', function (data) {
        process.stderr.write(data.toString())
    })

    p.on('error', function (err) {
        console.error('Failed to start build process:', err)
    })

    p.on('close', async function (code) {
        console.log('Build process exited with code', code)
        if (code !== 0) {
            console.error('Build failed with non-zero exit code. Aborting upload to S3.')
            process.exit(code)
        }
        console.log('Build Complete')

        // The default dist path is either output/dist or ./dist depending where build ran.
        let distFolderPath = path.join(outDirPath, 'dist')

        function listFilesRecursively(dir) {
            const results = []
            if (!fs.existsSync(dir)) return results
            const items = fs.readdirSync(dir)
            for (const item of items) {
                const full = path.join(dir, item)
                const stat = fs.lstatSync(full)
                if (stat.isDirectory()) {
                    const children = listFilesRecursively(full)
                    for (const c of children) results.push(path.join(item, c))
                } else {
                    results.push(item)
                }
            }
            return results
        }
        const distFolderfiles = listFilesRecursively(distFolderPath)

        console.log('Using dist folder:', distFolderPath)
        console.log('Files found in dist:', distFolderfiles.length)

        if (distFolderfiles.length === 0) {
            console.error('No files found to upload. Aborting.')
            process.exit(2)
        }

        // publishLog(`Starting to upload`)
        let failed = 0
        for (const file of distFolderfiles) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)

            const contentType = mime.lookup(filePath) || 'application/octet-stream'

            const command = new PutObjectCommand({
                Bucket: myBucket,
                Key: `hosted-websites/${pathBucket}/${file.replace(/\\\\/g, '/')}`,
                Body: fs.createReadStream(filePath),
                ContentType: contentType
            })

            try {
                await s3Client.send(command)
                console.log('uploaded', filePath)
            } catch (err) {
                failed++
                console.error('Failed to upload', filePath, err)
            }
        }
        console.log('Done...')
        if (failed) {
            console.error('Completed with', failed, 'failed uploads')
            process.exit(3)
        }
        process.exit(0)
    })
}

build();