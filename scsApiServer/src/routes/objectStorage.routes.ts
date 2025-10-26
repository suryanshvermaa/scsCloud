import { Router } from "express";
import { enableMinioBucketService, getBuckets } from "../controllers/objectStorage.controller";

const objectStorageRouter=Router();

objectStorageRouter
.post('/enable-bucket-service',enableMinioBucketService)
.post('/getBuckets',getBuckets)
export default objectStorageRouter;