import { Router } from "express";
import { createBucket, deleteBucket, deleteObjectController, enableMinioBucketService, getBuckets, getObject, getObjects, putObject } from "../controllers/objectStorage.controller";

const objectStorageRouter=Router();

objectStorageRouter
.post('/enable-bucket-service',enableMinioBucketService)
.post('/getBuckets',getBuckets)
.post('/create-bucket',createBucket)
.delete('/delete-bucket',deleteBucket)
.post('/put-object',putObject)
.get('/getObjects/:AccessCookie',getObjects) // bucket as query param
.get('/getObject/:AccessCookie',getObject) // bucket and objectKey as query params
.delete('/delete-object',deleteObjectController)

export default objectStorageRouter;