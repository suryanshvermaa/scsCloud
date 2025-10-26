import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/object-storage`;

export interface Bucket {
  Name: string;
  CreationDate: string;
}

export interface StorageObject {
  Key: string;
  LastModified: string;
  Size: number;
  ETag: string;
  StorageClass: string;
}

export interface EnableServiceResponse {
  StorageEndpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Enable Object Storage service for the user
 */
export const enableBucketService = async (storageInGB: number): Promise<EnableServiceResponse> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.post(`${API_BASE_URL}/enable-bucket-service`, {
    AccessCookie: accessToken,
    storageInGB,
  });
  return response.data.data;
};

/**
 * Get all buckets for the authenticated user
 */
export const getBuckets = async (): Promise<Bucket[]> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.post(`${API_BASE_URL}/getBuckets`, {
    AccessCookie: accessToken,
  });
  return response.data.data.buckets;
};

/**
 * Create a new bucket
 */
export const createBucket = async (bucketName: string): Promise<any> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.post(`${API_BASE_URL}/create-bucket`, {
    AccessCookie: accessToken,
    bucketName,
  });
  return response.data.data;
};

/**
 * Delete a bucket
 */
export const deleteBucket = async (bucketName: string): Promise<any> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.delete(`${API_BASE_URL}/delete-bucket`, {
    data: {
      AccessCookie: accessToken,
      bucketName,
    },
  });
  return response.data.data;
};

/**
 * Get a pre-signed URL for uploading an object
 */
export const getUploadUrl = async (
  bucketName: string,
  objectKey: string,
  objectSize: number
): Promise<string> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.post(`${API_BASE_URL}/put-object`, {
    AccessCookie: accessToken,
    bucketName,
    objectKey,
    objectSize,
  });
  return response.data.data.signedUrl;
};

/**
 * List all objects in a bucket
 */
export const listObjects = async (bucketName: string): Promise<StorageObject[]> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.get(
    `${API_BASE_URL}/getObjects/${accessToken}?bucket=${bucketName}`
  );
  return response.data.data.objects;
};

/**
 * Get a pre-signed URL for downloading an object
 */
export const getDownloadUrl = async (
  bucketName: string,
  objectKey: string
): Promise<string> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.get(
    `${API_BASE_URL}/getObject/${accessToken}?bucket=${bucketName}&objectKey=${objectKey}`
  );
  return response.data.data.signedUrl;
};

/**
 * Delete an object from a bucket
 */
export const deleteObject = async (
  bucketName: string,
  objectKey: string
): Promise<any> => {
  const accessToken = Cookies.get("AccessCookie");
  const response = await axios.delete(`${API_BASE_URL}/delete-object`, {
    data: {
      AccessCookie: accessToken,
      bucket: bucketName,
      objectKey,
    },
  });
  return response.data;
};

/**
 * Upload a file using the pre-signed URL
 */
export const uploadFile = async (signedUrl: string, file: File): Promise<void> => {
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
};
