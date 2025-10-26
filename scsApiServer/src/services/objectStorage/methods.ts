import { S3Client, PutObjectCommand, ListBucketsCommand, GetObjectCommand, DeleteObjectCommand, CreateBucketCommand, DeleteBucketCommand, ListObjectsCommand  } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getMinioManifests from "../k8s/getMinioManifests";
import { k8sObjectApi } from "../k8s/k8s";

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
    const base64encodedSecretKey=Buffer.from(secretkey,'utf-8').toString('base64');
    const base64encodedAccessKey=Buffer.from(accesskey,'utf-8').toString('base64');
    const userIdSanitized=userId.replace(/[^a-z0-9]/gi,'n').toLowerCase();//k8s resource name sanitization
    const {deployment,persistentVolume,persistentVolumeClaim,secrets,service,ingress}=getMinioManifests(userIdSanitized,storageInGB,base64encodedAccessKey,base64encodedSecretKey);
    await k8sObjectApi.create(secrets); //secret
    await k8sObjectApi.create(persistentVolume);//pv
    await k8sObjectApi.create(persistentVolumeClaim); // pvc
    await k8sObjectApi.create(deployment); // deployment
    await k8sObjectApi.create(service); // service
    await k8sObjectApi.create(ingress); // ingress
    return {StorageEndpoint:`http://minio-${userIdSanitized}.${process.env.HOSTING_DOMAIN!}`,serviceName:`minio-service-${userIdSanitized}`};
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
        },
        forcePathStyle:true,
    })
}

/**
 * @description list objects in a bucket
 * @param s3Client 
 * @param bucketName 
 * @param prefix 
 */
const listObjects=async(s3Client:S3Client,bucketName:string,prefix?:string)=>{
    const command = new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: prefix
    });
    return (await s3Client.send(command)).Contents;
}

/**
 * @description list all buckets
 * @param s3Client 
 */
const listBuckets=async(s3Client:S3Client)=>{
    return (await s3Client.send(new ListBucketsCommand())).Buckets;
}

/**
 * @description create a signed URL for uploading an object
 * @param s3Client 
 * @param bucketName 
 * @param objectKey 
 * @param contentType 
 */
const putObjectSignedUrl=async(s3Client:S3Client,bucketName:string,objectKey:string,expiresIn?:number)=>{
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
    });
    return await getSignedUrl(s3Client,command,{expiresIn:expiresIn || 3600});
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

const createS3Bucket=async(s3Client:S3Client,bucketName:string)=>{
    const command = new CreateBucketCommand({
        Bucket: bucketName,
    });
    return await s3Client.send(command);
}

const deleteS3Bucket=async(s3Client:S3Client,bucketName:string)=>{
    const command = new DeleteBucketCommand({
        Bucket: bucketName,
    });
    return await s3Client.send(command);
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
    createS3Bucket,
    deleteS3Bucket,
}