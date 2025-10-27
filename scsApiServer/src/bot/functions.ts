export function getOverview(): string {
  return [
    'Welcome to SCS Cloud! Here\'s what you can do:',
    '-',
    '• HLS Transcoder: Upload a 1080p source video and get adaptive HLS outputs (1080p/720p/480p/360p) with a master.m3u8.',
    '• Static Website Hosting: Deploy React/Vite (or other static) sites and receive a fast CDN-backed URL.',
    '• Object Storage API: Programmatically manage your storage using S3-compatible SDKs (upload, download, etc).',
    '-',
    'Docs quick links:',
    '• HLS Transcoder guide: Ask "hls guide" or "how to transcode"',
    '• Static Hosting guide: Ask "hosting guide" or "how to host static site"',
    '• Object Storage API guide: Ask "object storage guide" or "how to use object storage api"',
  ].join('\n');
}

// ---- Static Website Hosting ----

export function getStaticHostingOverview(): string {
  return [
    'Static Website Hosting lets you deploy static React/Vite apps and serve them over CDN for fast loads.',
    'Typical flow: Build → Upload → Served via CDN → Delivered to your users.',
  ].join('\n');
}

export function getStaticHostingSteps(): string {
  return [
    'Static Hosting: steps to prepare your app:',
    '1) Vite (React): in vite.config.ts/js set base: "./"',
    '2) Create React App: in package.json set "homepage": "./"',
    '3) If using react-router-dom, add a catch-all route (*) pointing to a safe page (e.g., Login/Home).',
    '4) Build your app (e.g., npm run build).',
    '5) Upload the built static files via the SCS console Hosting service.',
  ].join('\n');
}

export function getViteConfigSnippet(): string {
  return [
    'Vite config (vite.config.ts):',
    'import { defineConfig } from "vite"',
    "import react from '@vitejs/plugin-react'",
    '',
    'export default defineConfig({',
    "  plugins: [react()],",
    "  base: './',",
    '})',
  ].join('\n');
}

export function getCRAPackageJsonSnippet(): string {
  return [
    'Create React App package.json (relevant part):',
    '{',
    '  "name": "my-react-app",',
    '  "version": "0.1.0",',
    '  "homepage": "./",',
    '  "private": true,',
    '  ...',
    '}',
  ].join('\n');
}

export function getReactRouterCatchAllSnippet(): string {
  return [
    'react-router-dom catch-all route example:',
    "<Routes>",
    "  <Route path=\"/\" element={<Home />} />",
    "  <Route path=\"/login\" element={<Login />} />",
    "  <Route path=\"/register\" element={<Register />} />",
    "  <Route path=\"*\" element={<Login />} />",
    "</Routes>",
  ].join('\n');
}

// ---- HLS Transcoder ----

export function getHlsOverview(): string {
  return [
    'HLS Transcoder converts one 1080p input video into multiple renditions (1080p/720p/480p/360p) and produces a master.m3u8.',
    'You can use it for web, Android, or iOS playback with adaptive streaming.',
  ].join('\n');
}

export function getHlsSteps(): string {
  return [
    'HLS Transcoder: steps to use via console:',
    '1) Create an IAM user in AWS with putObject permission on your bucket.',
    '2) Save AccessKey and SecretAccessKey.',
    '3) Open SCS console → Services → HLS Transcoder.',
    '4) Select a 1080p source video.',
    '5) Fill required fields including your AWS credentials (to allow upload to your S3).',
  ].join('\n');
}

export function getHlsSdkInstall(): string {
  return 'Install SDK (Node.js):\nnpm install scs-hls-transcoder';
}

export function getHlsImports(): string {
  return [
    'CommonJS:',
    "const { VideoUploadUrl, TranscodingVideo } = require('scs-hls-transcoder');",
    '',
    'ESM:',
    "import { VideoUploadUrl, TranscodingVideo } from 'scs-hls-transcoder';",
  ].join('\n');
}

export function getHlsUploadExample(): string {
  return [
    'Upload flow (pseudocode):',
    'const resp = await VideoUploadUrl(apiKey);',
    '',
    '// resp: { uploadUrl, fileName }',
    'await fetch(resp.uploadUrl, { method: "PUT", body: videoFile, headers: { "Content-Type": "video/mp4" } });',
  ].join('\n');
}

export function getHlsTranscodingExample(): string {
  return [
    'Start transcoding (pseudocode):',
    'const out = await TranscodingVideo({',
    "  apiKey: 'your-api-key',",
    '  fileName: resp.fileName,',
    "  bucketName: 'your-s3-bucket',",
    "  accessKey: 'your-aws-access-key',",
    "  secretAccessKey: 'your-aws-secret-key',",
    "  region: 'us-east-1'",
    '});',
    '',
    '// out: { success, message, videoPath }',
  ].join('\n');
}

export const objectStorageOverview =()=> {
  return [  
  'Object Storage API allows you to programmatically interact with SCS Object Storage using S3-compatible SDKs.',
  'You can perform operations like uploading, downloading, and managing objects in your storage buckets.',
].join('\n');
};

export const getObjectStorageApiSetupNodejs=(): string => {
  return [
    'Node.js Object Storage API setup:',
    "import { S3Client } from '@aws-sdk/client-s3';",
    '',
    'const s3Client = new S3Client({',
    "  region: 'us-east-1',",
    "  endpoint: 'https://your-s3-endpoint.com',",
    "  credentials: {",
    "    accessKeyId: 'your-aws-access-key',",
    "    secretAccessKey: 'your-aws-secret-key'",
    "  }",
    "  forcePathStyle: true,",
    '});',
  ].join('\n');
}
