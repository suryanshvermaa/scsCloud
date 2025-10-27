# Object Storage API Documentation

## Overview
The Object Storage API provides endpoints for managing S3-compatible object storage services. Users can enable storage services, manage buckets, and perform object operations (upload, download, list, delete).

**Base URL:** `/api/v1/object-storage`

**Authentication:** All endpoints require an `AccessCookie` (JWT token) for authentication.

---

## Table of Contents
- [Enable Bucket Service](#1-enable-bucket-service)
- [Get Buckets](#2-get-buckets)
- [Create Bucket](#3-create-bucket)
- [Delete Bucket](#4-delete-bucket)
- [Upload Object (Get Signed URL)](#5-upload-object-get-signed-url)
- [List Objects](#6-list-objects)
- [Get Object (Download)](#7-get-object-download)
- [Delete Object](#8-delete-object)
- [Get Object Storage Info](#9-get-object-storage-info)
- [Extend Storage Expiration](#10-extend-storage-expiration)
- [Error Responses](#error-responses)

---

## Endpoints

### 1. Enable Bucket Service

Enable the Minio object storage service for a user.

**Endpoint:** `POST /api/v1/object-storage/enable-bucket-service`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "storageInGB": "number (required) - Storage size in GB"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage Bucket Service enabled successfully",
  "data": {
    "StorageEndpoint": "string - Endpoint URL for the storage service",
    "accessKeyId": "string - Generated access key",
    "secretAccessKey": "string - Generated secret key"
  }
}
```

**Cost Calculation:**
- Cost is calculated based on `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES` environment variable
- Amount is deducted from user's SCS Coins
- Service is valid for 1 month from enablement

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `404`: User not found
- `400`: Insufficient SCS Coins

---

### 2. Get Buckets

Retrieve all buckets for the authenticated user.

**Endpoint:** `POST /api/v1/object-storage/getBuckets`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage Buckets retrieved successfully",
  "data": {
    "buckets": [
      {
        "Name": "string - Bucket name",
        "CreationDate": "string - ISO 8601 date"
      }
    ]
  }
}
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload
- `404`: Object Storage not found (service not enabled)

---

### 3. Create Bucket

Create a new S3 bucket.

**Endpoint:** `POST /api/v1/object-storage/create-bucket`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "bucketName": "string (required) - Name of the bucket to create"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage Bucket created successfully",
  "data": {
    "metadata": {
      "httpStatusCode": 200,
      "requestId": "string",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  }
}
```

**Bucket Naming Rules:**
- Must be unique across the storage service
- 3-63 characters long
- Lowercase letters, numbers, hyphens allowed
- Must start and end with a letter or number

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or invalid bucket name
- `404`: Object Storage not found

---

### 4. Delete Bucket

Delete an existing S3 bucket.

**Endpoint:** `DELETE /api/v1/object-storage/delete-bucket`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "bucketName": "string (required) - Name of the bucket to delete"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage Bucket deleted successfully",
  "data": {
    "metadata": {
      "httpStatusCode": 204,
      "requestId": "string",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  }
}
```

**Notes:**
- Bucket must be empty before deletion
- Attempting to delete a non-empty bucket will result in an error

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or bucket not empty
- `404`: Object Storage or bucket not found

---

### 5. Upload Object (Get Signed URL)

Get a pre-signed URL for uploading an object to a bucket.

**Endpoint:** `POST /api/v1/object-storage/put-object`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "bucketName": "string (required) - Target bucket name",
  "objectKey": "string (required) - Object key/path in bucket",
  "objectSize": "number (required) - Object size in KB"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Storage Object created successfully",
  "data": {
    "signedUrl": "string - Pre-signed URL for upload (PUT request)"
  }
}
```

**Usage:**
1. Call this endpoint to get a signed URL
2. Use the signed URL to upload your file via HTTP PUT
3. URL expiry time is calculated as: `objectSize * 2` seconds

**Example Upload:**
```bash
curl -X PUT -H "Content-Type: application/octet-stream" \
     --data-binary @yourfile.txt \
     "SIGNED_URL_HERE"
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or missing parameters
- `404`: Object Storage or bucket not found

---

### 6. List Objects

List all objects in a specific bucket.

**Endpoint:** `GET /api/v1/object-storage/getObjects/:AccessCookie`

**URL Parameters:**
- `AccessCookie` (required) - JWT access token

**Query Parameters:**
- `bucket` (required) - Bucket name

**Example Request:**
```
GET /api/v1/object-storage/getObjects/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...?bucket=my-bucket
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Objects retrieved successfully",
  "data": {
    "objects": [
      {
        "Key": "string - Object key/path",
        "LastModified": "string - ISO 8601 date",
        "Size": "number - Size in bytes",
        "ETag": "string - Entity tag",
        "StorageClass": "string - Storage class"
      }
    ]
  }
}
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or missing bucket parameter
- `404`: Object Storage or bucket not found

---

### 7. Get Object (Download)

Get a pre-signed URL for downloading an object from a bucket.

**Endpoint:** `GET /api/v1/object-storage/getObject/:AccessCookie`

**URL Parameters:**
- `AccessCookie` (required) - JWT access token

**Query Parameters:**
- `bucket` (required) - Bucket name
- `objectKey` (required) - Object key/path

**Example Request:**
```
GET /api/v1/object-storage/getObject/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...?bucket=my-bucket&objectKey=file.txt
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object retrieved successfully",
  "data": {
    "signedUrl": "string - Pre-signed URL for download (GET request)"
  }
}
```

**Usage:**
1. Call this endpoint to get a signed URL
2. Use the signed URL to download the file via HTTP GET
3. URL is valid for a limited time (default expiry)

**Example Download:**
```bash
curl -o downloaded-file.txt "SIGNED_URL_HERE"
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or missing parameters
- `404`: Object Storage, bucket, or object not found

---

### 8. Delete Object

Delete an object from a bucket.

**Endpoint:** `DELETE /api/v1/object-storage/delete-object`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token",
  "bucket": "string (required) - Bucket name",
  "objectKey": "string (required) - Object key/path to delete"
}
```

**Response:**
```json
{
  "statusCode": 204,
  "message": "Object deleted successfully",
  "data": {}
}
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or missing parameters
- `404`: Object Storage, bucket, or object not found

---

### 9. Get Object Storage Info

Retrieve object storage service information and credentials for the authenticated user.

**Endpoint:** `GET /api/v1/object-storage/getStorageInfo/:AccessCookie`

**URL Parameters:**
- `AccessCookie` (required) - JWT access token

**Example Request:**
```
GET /api/v1/object-storage/getStorageInfo/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage credentials retrieved successfully",
  "data": {
    "accessKey": "string - S3 access key",
    "secretKey": "string - S3 secret key",
    "storageEndpoint": "string - Storage endpoint URL",
    "storageInGB": "number - Allocated storage size in GB",
    "expiryDate": "string - ISO 8601 date when service expires"
  }
}
```

**Use Cases:**
- Retrieve storage credentials for direct S3 client configuration
- Check storage allocation and expiry date
- Get endpoint URL for accessing the storage service

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload
- `404`: Object Storage not found (service not enabled)

---

### 10. Extend Storage Expiration

Extend the expiration date of the object storage service by one month.

**Endpoint:** `POST /api/v1/object-storage/extendStorageExpiration`

**Request Body:**
```json
{
  "AccessCookie": "string (required) - JWT access token"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object Storage expiration extended successfully",
  "data": {}
}
```

**Behavior:**
- Extends the expiration date by exactly 1 month from the current expiry date
- Charges based on the formula: `storageInGB * STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES`
- Amount is deducted from user's SCS Coins
- Can be called multiple times to extend further

**Example:**
- Current expiry: 2025-11-27
- After extension: 2025-12-27

**Cost Calculation:**
```
Total Cost = storageInGB × Price per GB per Month
```

**Error Scenarios:**
- `401`: AccessCookie is required or Unauthorized Access
- `400`: Invalid token payload or Insufficient SCS Coins
- `404`: User not found or Object Storage not found

**Important Notes:**
- Ensure sufficient SCS Coins balance before extending
- Extension is calculated from the current expiry date, not today's date
- Service remains active during the extension process

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "statusCode": 400 | 401 | 404 | 500,
  "message": "Error message description",
  "error": "Error details (if available)"
}
```

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| `400` | Bad Request - Invalid parameters or insufficient resources |
| `401` | Unauthorized - Missing or invalid AccessCookie |
| `404` | Not Found - User, storage service, bucket, or object not found |
| `500` | Internal Server Error - Unexpected server error |

---

## Authentication

All endpoints require authentication via `AccessCookie` (JWT token). The token should contain:

```json
{
  "userId": "string - MongoDB user ID",
  // ... other JWT claims
}
```

**Token Verification:**
- Tokens are verified using `ACCESS_TOKEN_SECRET` environment variable
- Invalid or expired tokens will result in 401 Unauthorized error

---

## Data Models

### Object Storage Model
```typescript
{
  userId: ObjectId,
  accessKey: string,
  secretAccessKey: string,
  storageInGB: number,
  storageEndpoint: string,
  expiryDate: Date,
  service: string
}
```

### User Model (Relevant Fields)
```typescript
{
  objectStorageServiceEnabled: boolean,
  SCSCoins: number
}
```

---

## Environment Variables

Required environment variables:
- `ACCESS_TOKEN_SECRET` - Secret key for JWT verification
- `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES` - Pricing per GB per month

---

## Notes

1. **Service Endpoints:**
   - Production: `http://{service-name}.minio.svc.cluster.local:9000` (inside K8s)
   - Local Testing: `http://localhost:9000`

2. **Storage Limitations:**
   - Storage is allocated based on the `storageInGB` parameter
   - Users must have sufficient SCS Coins to enable the service

3. **Pre-signed URLs:**
   - Upload URLs expire based on object size: `objectSize * 2` seconds
   - Download URLs have default S3 expiry (typically 3600 seconds)

4. **Best Practices:**
   - Always check bucket existence before operations
   - Ensure buckets are empty before deletion
   - Handle pre-signed URL expiry appropriately in client applications
   - Store access keys securely (never expose in client-side code)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-27 | Initial API documentation |

---

## Support

For issues or questions, please contact the API support team or refer to the main API documentation at `docs/API.md`.
