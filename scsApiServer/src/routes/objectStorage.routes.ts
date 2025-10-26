import { Router } from "express";
import { createBucket, enableMinioBucketService, getBuckets } from "../controllers/objectStorage.controller";

const objectStorageRouter=Router();

objectStorageRouter
.post('/enable-bucket-service',enableMinioBucketService)
.post('/getBuckets',getBuckets)
.post('/create-bucket',createBucket);
export default objectStorageRouter;