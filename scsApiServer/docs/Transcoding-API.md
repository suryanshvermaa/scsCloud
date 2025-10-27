# HLS Transcoding Service API Documentation

## Overview
The HLS Transcoding Service API provides endpoints for uploading and transcoding videos to HLS (HTTP Live Streaming) format. The service supports multiple qualities and formats optimized for adaptive bitrate streaming.

**Base URL:** `/api/v1`

**Authentication:** Supports two authentication methods:
1. **AccessCookie** - JWT token-based authentication
2. **Credentials** - Access Key and Secret Access Key authentication

---

## Table of Contents
- [Authentication Methods](#authentication-methods)
- [Upload Video URL](#1-upload-video-url)
- [Transcode Video](#2-transcode-video)
- [Workflow](#workflow)
- [Cost Calculation](#cost-calculation)
- [Error Responses](#error-responses)

---

## Authentication Methods

### Method 1: AccessCookie Authentication
Use JWT access token obtained from user login.

```json
{
  "AccessCookie": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Method 2: Credentials Authentication
Use access key and secret access key.

```json
{
  "credentials": {
    "accessKey": "jwt_signed_access_key",
    "secretAccessKey": "jwt_signed_secret_key"
  }
}
```

**Note:** Both authentication methods are mutually exclusive. Use one or the other, not both.

---

## Endpoints

### 1. Upload Video URL

Generate a pre-signed URL for uploading a video file to object storage before transcoding.

**Endpoint:** `POST /api/v1/upload-video`

**Authentication:** Required (AccessCookie or Credentials)

**Request Body:**

#### Using AccessCookie:
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "fileName": "string (required) - Name of the video file",
  "videoSizeInMB": "number (required) - Size of video in MB",
  "bucketName": "string (required) - Target S3 bucket name"
}
```

#### Using Credentials:
```json
{
  "credentials": {
    "accessKey": "string (required) - User access key",
    "secretAccessKey": "string (required) - User secret access key"
  },
  "fileName": "string (required) - Name of the video file",
  "videoSizeInMB": "number (required) - Size of video in MB",
  "bucketName": "string (required) - Target S3 bucket name"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "uploading video",
  "data": {
    "uploadUrl": "string - Pre-signed S3 URL for uploading the video",
    "videoKey": "string - Key path where video will be stored (outputs/{fileName})",
    "email": "string - User's email address"
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "message": "uploading video",
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/outputs/video.mp4?X-Amz-...",
    "videoKey": "outputs/video.mp4",
    "email": "user@example.com"
  }
}
```

**Upload Process:**
1. Call this endpoint to get a pre-signed URL
2. Use the returned `uploadUrl` to upload your video file via HTTP PUT
3. Use the `videoKey` in the next step for transcoding

**Example Upload:**
```bash
# Step 1: Get upload URL
curl -X POST https://api.example.com/api/v1/upload-video \
  -H "Content-Type: application/json" \
  -d '{
    "AccessCookie": "your_token_here",
    "fileName": "my-video.mp4",
    "videoSizeInMB": 150,
    "bucketName": "my-bucket"
  }'

# Step 2: Upload file to pre-signed URL
curl -X PUT -H "Content-Type: video/mp4" \
  --data-binary @my-video.mp4 \
  "RETURNED_UPLOAD_URL"
```

**Validation Checks:**
- User must have Object Storage Service enabled
- User must have sufficient SCS Coins (cost = `TRANSCODER_SERVICE_CHARGE` × `videoSizeInMB`)
- Object Storage must be configured for the user
- Credentials must be active (for credential-based auth)

**Error Scenarios:**
- `400`: fileName is required, Insufficient SCSCoins, Object Storage not configured
- `401`: Invalid Access Cookie, Invalid Credentials, Authentication required
- `403`: Object Storage Service is not enabled, Credentials are not active
- `404`: User not found

---

### 2. Transcode Video

Initiate the HLS transcoding process for an uploaded video.

**Endpoint:** `POST /api/v1/transcoding-video`

**Authentication:** Required (AccessCookie or Credentials)

**Request Body:**

#### Using AccessCookie:
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "videoKey": "string (required) - S3 key of uploaded video (from upload response)",
  "bucketPath": "string (required) - S3 bucket path",
  "userBucketName": "string (required) - User's S3 bucket name",
  "email": "string (required) - User's email for notifications",
  "videoSizeInMB": "number (required) - Size of video in MB"
}
```

#### Using Credentials:
```json
{
  "credentials": {
    "accessKey": "string (required) - User access key",
    "secretAccessKey": "string (required) - User secret access key"
  },
  "videoKey": "string (required) - S3 key of uploaded video",
  "bucketPath": "string (required) - S3 bucket path",
  "userBucketName": "string (required) - User's S3 bucket name",
  "email": "string (required) - User's email for notifications",
  "videoSizeInMB": "number (required) - Size of video in MB"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "transcoding process is queued. when transcoding completes we will notify through email",
  "data": {}
}
```

**Transcoding Process:**
1. Video is queued for transcoding
2. HLS segments are generated with multiple quality variants
3. User receives email notification when transcoding completes
4. Output files are stored in the user's bucket

**Cost Deduction:**
- Cost is calculated as: `TRANSCODER_SERVICE_CHARGE` × `videoSizeInMB`
- Amount is deducted from user's SCS Coins immediately
- Transcoding is queued only after successful payment

**Validation Checks:**
- All required fields must be provided
- User must exist in the system
- User must have sufficient SCS Coins
- Object Storage must be configured
- Credentials must be active (for credential-based auth)

**Error Scenarios:**
- `400`: All fields are required, Insufficient SCSCoins, Object Storage not configured
- `401`: Invalid Access Cookie, Invalid Credentials, Authentication required
- `403`: Credentials are not active
- `404`: User not found, User secret access key not found

**Output Format:**
- HLS playlist (.m3u8 files)
- Multiple quality variants (e.g., 360p, 480p, 720p, 1080p)
- Segmented video files (.ts files)
- Stored in user's specified bucket path

---

## Workflow

### Complete Transcoding Workflow

```
1. Check Balance
   ↓
2. Generate Upload URL (POST /api/v1/upload-video)
   ↓
3. Upload Video to Pre-signed URL
   ↓
4. Initiate Transcoding (POST /api/v1/transcoding-video)
   ↓
5. Receive Email Notification
   ↓
6. Access HLS Output from Bucket
```

### Detailed Steps:

#### Step 1: Check Sufficient Balance
```javascript
const videoSizeMB = 150;
const costPerMB = 0.50; // From /api/v1/cost/transcoding-cost-per-mb
const totalCost = videoSizeMB * costPerMB;
// Ensure user has >= totalCost SCS Coins
```

#### Step 2: Get Upload URL
```javascript
const uploadResponse = await fetch('/api/v1/upload-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    AccessCookie: userToken,
    fileName: 'video.mp4',
    videoSizeInMB: 150,
    bucketName: 'my-bucket'
  })
});
const { uploadUrl, videoKey, email } = uploadResponse.data;
```

#### Step 3: Upload Video
```javascript
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/mp4' },
  body: videoFile
});
```

#### Step 4: Start Transcoding
```javascript
await fetch('/api/v1/transcoding-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    AccessCookie: userToken,
    videoKey: videoKey,
    bucketPath: 'videos/',
    userBucketName: 'my-bucket',
    email: email,
    videoSizeInMB: 150
  })
});
```

---

## Cost Calculation

### Pricing Formula
```
Total Cost = Video Size (MB) × Cost per MB
```

### Example Calculations

| Video Size | Cost per MB | Total Cost |
|------------|-------------|------------|
| 50 MB      | ₹0.50      | ₹25        |
| 100 MB     | ₹0.50      | ₹50        |
| 500 MB     | ₹0.50      | ₹250       |
| 1 GB (1024 MB) | ₹0.50  | ₹512       |

**Note:** Cost per MB is configured via `TRANSCODER_SERVICE_CHARGE` environment variable. Use the Cost API (`/api/v1/cost/transcoding-cost-per-mb`) to get current pricing.

---

## Error Responses

### Error Response Format
```json
{
  "statusCode": 400 | 401 | 403 | 404 | 500,
  "message": "Error message description",
  "error": "Error details (if available)"
}
```

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| `400` | Bad Request - Missing required fields, insufficient balance, or invalid parameters |
| `401` | Unauthorized - Invalid or missing authentication credentials |
| `403` | Forbidden - Service not enabled or credentials not active |
| `404` | Not Found - User or resources not found |
| `500` | Internal Server Error - Unexpected server error |

### Specific Error Messages

#### Upload Video URL Errors:
- `fileName is required` (400)
- `Invalid Access Cookie` (401)
- `Invalid Credentials` (401)
- `Authentication required` (401)
- `User not found` (404)
- `Object Storage Service is not enabled` (403)
- `Credentials are not active` (403)
- `Insufficient SCSCoins` (400)
- `Object Storage not configured` (400)
- `Credentials are required` (400)
- `Credentials do not match` (401)

#### Transcode Video Errors:
- `All fields are required` (400)
- `Access Cookie is required` (400)
- `Invalid Access Cookie` (401)
- `User not found` (404)
- `Insufficient SCSCoins` (400)
- `Object Storage not configured` (400)
- `Credentials are required` (400)
- `Invalid Credentials` (401)
- `Credentials are not active` (403)
- `User secret access key not found` (404)
- `Authentication required` (401)

---

## Prerequisites

### User Requirements:
1. **Active Account**: User must be registered and authenticated
2. **Object Storage Service**: Must be enabled for the user
3. **Sufficient Balance**: SCS Coins ≥ (Video Size in MB × Cost per MB)
4. **Object Storage Configuration**: User must have object storage configured

### For Credential-Based Auth:
- Credentials must be generated and active
- Access Key and Secret Access Key must be valid JWT tokens
- Credentials must match user's stored credentials

---

## Environment Variables

Required environment variables for the transcoding service:

| Variable | Description |
|----------|-------------|
| `ACCESS_TOKEN_SECRET` | Secret for JWT access token verification |
| `ACCESS_KEY_CREDENTIALS_SECRET` | Secret for access key JWT verification |
| `SECRET_ACCESS_KEY_CREDENTIALS_SECRET` | Secret for secret key JWT verification |
| `TRANSCODER_SERVICE_CHARGE` | Cost per MB for transcoding |
| `IS_UNDER_KUBERNETES` | Flag to determine endpoint (true/false) |

---

## Notifications

### Email Notifications
Users receive email notifications when:
- Transcoding process completes successfully
- Transcoding fails (with error details)

Email includes:
- Video file name
- Transcoding status
- Output location (bucket path)
- Access instructions for HLS files

---

## Integration Examples

### JavaScript/TypeScript
```typescript
async function transcodeVideo(token: string, videoFile: File, bucketName: string) {
  // Step 1: Get upload URL
  const uploadRes = await fetch('/api/v1/upload-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      AccessCookie: token,
      fileName: videoFile.name,
      videoSizeInMB: Math.ceil(videoFile.size / (1024 * 1024)),
      bucketName: bucketName
    })
  });
  
  const { uploadUrl, videoKey, email } = (await uploadRes.json()).data;
  
  // Step 2: Upload video
  await fetch(uploadUrl, {
    method: 'PUT',
    body: videoFile,
    headers: { 'Content-Type': videoFile.type }
  });
  
  // Step 3: Start transcoding
  const transcodeRes = await fetch('/api/v1/transcoding-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      AccessCookie: token,
      videoKey: videoKey,
      bucketPath: 'videos/',
      userBucketName: bucketName,
      email: email,
      videoSizeInMB: Math.ceil(videoFile.size / (1024 * 1024))
    })
  });
  
  return await transcodeRes.json();
}
```

### Python
```python
import requests
import os

def transcode_video(token, video_path, bucket_name):
    # Get file size in MB
    file_size_mb = os.path.getsize(video_path) / (1024 * 1024)
    file_name = os.path.basename(video_path)
    
    # Step 1: Get upload URL
    upload_response = requests.post('https://api.example.com/api/v1/upload-video', 
        json={
            'AccessCookie': token,
            'fileName': file_name,
            'videoSizeInMB': int(file_size_mb),
            'bucketName': bucket_name
        }
    )
    
    data = upload_response.json()['data']
    upload_url = data['uploadUrl']
    video_key = data['videoKey']
    email = data['email']
    
    # Step 2: Upload video
    with open(video_path, 'rb') as f:
        requests.put(upload_url, data=f, headers={'Content-Type': 'video/mp4'})
    
    # Step 3: Start transcoding
    transcode_response = requests.post('https://api.example.com/api/v1/transcoding-video',
        json={
            'AccessCookie': token,
            'videoKey': video_key,
            'bucketPath': 'videos/',
            'userBucketName': bucket_name,
            'email': email,
            'videoSizeInMB': int(file_size_mb)
        }
    )
    
    return transcode_response.json()
```

---

## Best Practices

1. **Validate File Size**: Check video size and calculate cost before initiating upload
2. **Check Balance**: Verify user has sufficient SCS Coins before upload
3. **Handle Upload Errors**: Implement retry logic for network failures during upload
4. **Monitor Progress**: Inform users about upload and transcoding progress
5. **Store VideoKey**: Save the videoKey from upload response for transcoding request
6. **Timeout Handling**: Set appropriate timeouts for large file uploads
7. **File Validation**: Validate video format before uploading
8. **Error Recovery**: Implement proper error handling and user feedback

---

## Limitations

- Maximum video size: Depends on configured limits
- Supported formats: MP4, MOV, AVI, MKV (input)
- Output format: HLS (.m3u8 + .ts segments)
- Processing time: Varies based on video size and quality settings
- Concurrent transcoding: Limited by system resources

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-28 | Initial HLS Transcoding API documentation |

---

## Support

For technical support or questions about the transcoding service, please contact the API support team or refer to the main API documentation at `docs/API.md`.
