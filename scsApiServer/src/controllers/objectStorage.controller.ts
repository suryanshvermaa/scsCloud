import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import response from "../utils/response";
import jwt from "jsonwebtoken"
import User from "../models/user.model";
import { AppError } from "../utils/error";
import ObjectStorage from "../models/object-storage.model";
import { createS3Bucket, deleteObject, deleteS3Bucket, enableBucketService, getObjectSignedUrl, getS3Client, listBuckets, listObjects, putObjectSignedUrl } from "../services/objectStorage/methods";

/**
 * @description generate random access key and secret key
 * @returns {Object} accessKey and secretKey
 */
const generateStorageAccessKeyAndSecretKey = () => {
    const accessKey = Math.random().toString(36).substring(2, 12);
    const secretKey = Math.random().toString(36).substring(2, 18);
    return { accessKey, secretKey };
}

/**
 * @description Enable Minio Bucket Service for a user
 * @param req request object
 * @param res response object
 */
export const enableMinioBucketService = asyncHandler(async (req:Request, res:Response) =>{
    const {AccessCookie,storageInGB} = req.body;
    if(!AccessCookie) throw new AppError("AccessCookie is required",401);
    const { accessKey, secretKey } = generateStorageAccessKeyAndSecretKey();
    const isVerified = jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if(!isVerified) throw new AppError("Unauthorized Access",401);
    const {userId}=JSON.parse(JSON.stringify(isVerified));

    const user=await User.findById(userId);
    if(!user) throw new AppError("User not found",404);
    const storagePrice=parseInt(process.env.STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES!) * parseInt(storageInGB);
    if(user&&user.SCSCoins<storagePrice) throw new AppError("Insufficient SCS Coins. Please recharge your account.",400);
    user.objectStorageServiceEnabled=true;
    user.SCSCoins-=storagePrice;
    const {StorageEndpoint,serviceName}=await enableBucketService(userId,storageInGB,accessKey,secretKey);
    const objectStorage=await ObjectStorage.create({
        userId:user._id,
        accessKey,
        secretAccessKey:secretKey,
        storageInGB,
        storageEndpoint:StorageEndpoint,
        expiryDate:new Date(new Date().setMonth(new Date().getMonth()+1)),
        service:serviceName
    })
    
    await user.save();
    await objectStorage.save();

    console.log("Enabled Bucket Service for User ID:", userId);
    return response(res,200,"Object Storage Bucket Service enabled successfully",{
        StorageEndpoint,
        accessKeyId:accessKey,
        secretAccessKey:secretKey,
    });
});


/**
 * @description
 * @param req Request object
 * @param res Response object
 */
export const getBuckets = asyncHandler(async (req: Request, res: Response) => {
    const { AccessCookie } = req.body;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified =await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if(!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);

    const s3Client=getS3Client({
        region:"ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint:`http://localhost:9000`, //for local testing
        accessKeyId:objectStorage.accessKey,
        secretAccessKey:objectStorage.secretAccessKey
    });
    const buckets=await listBuckets(s3Client);
    return response(res, 200, "Object Storage Buckets retrieved successfully", {
        buckets: buckets
    });
});

/**
 * @description Create an S3 bucket
 * @param req Request object
 * @param res Response object
 */
export const createBucket = asyncHandler(async (req: Request, res: Response) => {
    const {AccessCookie, bucketName} = req.body;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if(!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client=getS3Client({
        region:"ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint:`http://localhost:9000`, //for local testing
        accessKeyId:objectStorage.accessKey,
        secretAccessKey:objectStorage.secretAccessKey
    });
    const result=await createS3Bucket(s3Client,bucketName);
    return response(res, 200, "Object Storage Bucket created successfully", {
        metadata: result.$metadata
    });
});

/**
 * @description Delete an S3 bucket
 * @param req Request object
 * @param res Response object
 */
export const deleteBucket = asyncHandler(async (req: Request, res: Response) => {
    const {AccessCookie, bucketName} = req.body;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if(!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client=getS3Client({
        region:"ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint:`http://localhost:9000`, //for local testing
        accessKeyId:objectStorage.accessKey,
        secretAccessKey:objectStorage.secretAccessKey
    });
    const result=await deleteS3Bucket(s3Client,bucketName);
    return response(res, 200, "Object Storage Bucket deleted successfully", {
        metadata: result.$metadata
    });
});

/**
 * @description
 * @param req Request object
 * @param res Response object
 */
export const putObject = asyncHandler(async (req: Request, res: Response) => {
    const { AccessCookie, bucketName, objectKey,objectSize } = req.body;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if (!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client = getS3Client({
        region: "ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint: `http://localhost:9000`, //for local testing
        accessKeyId: objectStorage.accessKey,
        secretAccessKey: objectStorage.secretAccessKey
    });
    const result = await putObjectSignedUrl(s3Client, bucketName, objectKey,parseInt(objectSize)*2); // expiry time based on object size in KB
    return response(res, 200, "Storage Object created successfully", {
        signedUrl: result
    });
});

/**
 * @description Get objects in a bucket
 * @param req Request object
 * @param res Response object
 */
export const getObjects = asyncHandler(async (req: Request, res: Response) => {
    const { AccessCookie } = req.params;
    const { bucket } = req.query;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if (!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client = getS3Client({
        region: "ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint: `http://localhost:9000`, //for local testing
        accessKeyId: objectStorage.accessKey,
        secretAccessKey: objectStorage.secretAccessKey
    });
    const result = await listObjects(s3Client, bucket as string);
    return response(res, 200, "Objects retrieved successfully", {
        objects: result
    });
});

/**
 * @description Get object metadata
 * @param req Request object
 * @param res Response object
 */
export const getObject = asyncHandler(async (req: Request, res: Response) => {
    const { AccessCookie } = req.params;
    const { bucket, objectKey } = req.query;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if (!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client = getS3Client({
        region: "ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint: `http://localhost:9000`, //for local testing
        accessKeyId: objectStorage.accessKey,
        secretAccessKey: objectStorage.secretAccessKey
    });
    const result = await getObjectSignedUrl(s3Client, bucket as string, objectKey as string);
    return response(res, 200, "Object retrieved successfully", {
        signedUrl: result
    });
});

/**
 * @description
 * @param req Request object
 * @param res Response object
 */
export const deleteObjectController = asyncHandler(async (req: Request, res: Response) => {
    const {AccessCookie, bucket, objectKey } = req.body;
    if (!AccessCookie) throw new AppError("AccessCookie is required", 401);
    const isVerified = await jwt.verify(AccessCookie, process.env.ACCESS_TOKEN_SECRET as string);
    if (!isVerified) throw new AppError("Unauthorized Access", 401);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if (!userId) throw new AppError("Invalid token payload", 400);
    const objectStorage = await ObjectStorage.findOne({ userId: userId });
    if (!objectStorage) throw new AppError("Object Storage not found", 404);
    const s3Client = getS3Client({
        region: "ap-south-1",
        // endpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000`, //inside k8s cluster
        endpoint: `http://localhost:9000`, //for local testing
        accessKeyId: objectStorage.accessKey,
        secretAccessKey: objectStorage.secretAccessKey
    });
    await deleteObject(s3Client, bucket as string, objectKey as string);
    return response(res, 204, "Object deleted successfully",{});
});
