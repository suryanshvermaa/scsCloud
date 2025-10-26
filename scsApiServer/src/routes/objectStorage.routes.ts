import { Router } from "express";
import { createBucket, deleteBucket, enableMinioBucketService, getBuckets, putObject } from "../controllers/objectStorage.controller";

const objectStorageRouter=Router();

objectStorageRouter
.post('/enable-bucket-service',enableMinioBucketService)
.post('/getBuckets',getBuckets)
.post('/create-bucket',createBucket)
.delete('/delete-bucket',deleteBucket)
.post('/put-object',putObject)
export default objectStorageRouter;