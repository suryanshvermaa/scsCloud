import { S3Client, ListObjectsV2Command, PutObjectCommand, ListBucketsCommand, GetObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getMinioManifests from "../k8s/getMinioManifests";
import { k8sAppsV1Api, k8sCoreV1Api, k8sObjectApi } from "../k8s/k8s";

interface IS3ClientConfig{
    region: string;
    endpoint:string;
    accessKeyId:string;
    secretAccessKey?:string;
}

/**
 * @description enable bucket service for a user by deploying Minio in k8s
 * @param userId userId 
 * @param storageInGB storage size in GB
 * @param accesskey accesskey for Minio
 * @param secretkey secretkey for Minio
 * @returns {StorageEndpoint:string} endpoint
 */
const enableBucketService=async(userId:string,storageInGB:number,accesskey:string,secretkey:string)=>{
    const {deployment,persistentVolume,persistentVolumeClaim,secrets,service,ingress}=getMinioManifests(userId,storageInGB,accesskey,secretkey);
    await k8sCoreV1Api.createNamespacedSecret("minio",secrets); //secret
    await k8sObjectApi.create(persistentVolume);//pv
    await k8sCoreV1Api.createNamespacedPersistentVolumeClaim("minio",persistentVolumeClaim); // pvc
    await k8sAppsV1Api.createNamespacedDeployment("minio",deployment); // deployment
    await k8sObjectApi.create(service); // service
    await k8sObjectApi.create(ingress); // ingress
    return {StorageEndpoint:`http://minio-${userId}.${process.env.HOSTING_DOMAIN!}`,accessKeyId:accesskey,secretAccessKey:secretkey};
} 

/**
 * @description get S3 Client instance
 * @param s3ClientConfig 
 * @returns 
 */
const getS3Client=(s3ClientConfig:IS3ClientConfig):S3Client=>{
    return new S3Client({
        region:s3ClientConfig.region!,
        endpoint:s3ClientConfig.endpoint!,
        credentials:{
            accessKeyId:s3ClientConfig.accessKeyId!,
            secretAccessKey:s3ClientConfig.secretAccessKey!
        }
    })
}

/**
 * @description list objects in a bucket
 * @param s3Client 
 * @param bucketName 
 * @param prefix 
 */
const listObjects=async(s3Client:S3Client,bucketName:string,prefix?:string)=>{
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix
    });
    return await s3Client.send(command);
}

/**
 * @description list all buckets
 * @param s3Client 
 */
const listBuckets=async(s3Client:S3Client)=>{
    return await s3Client.send(new ListBucketsCommand());
}

/**
 * @description create a signed URL for uploading an object
 * @param s3Client 
 * @param bucketName 
 * @param objectKey 
 * @param contentType 
 */
const putObjectSignedUrl=async(s3Client:S3Client,bucketName:string,objectKey:string,contentType?:string)=>{
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: contentType
    });
    return await getSignedUrl(s3Client,command,{expiresIn:3600})
}

/**
 * @description create a signed URL for downloading an object
 * @param s3Client 
 * @param bucketName 
 * @param objectKey 
 */
const getObjectSignedUrl=async(s3Client:S3Client,bucketName:string,objectKey:string)=>{
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    });
    return await getSignedUrl(s3Client,command,{expiresIn:3600})
}

const deleteObject=async(s3Client:S3Client,bucketName:string,objectKey:string)=>{
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    });
    return await s3Client.send(command);
}

const getObjectMetadata=async(s3Client:S3Client,bucketName:string,objectKey:string)=>{
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    });
    return (await s3Client.send(command)).Metadata;
}

export {
    getS3Client,
    listObjects,
    putObjectSignedUrl,
    listBuckets,
    getObjectSignedUrl,
    deleteObject,
    getObjectMetadata,
    enableBucketService,
}