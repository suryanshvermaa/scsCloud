import { Router } from "express";
import { getCostDetailsInRupees, getHostingCostPer30Days, getObjectStorageCostPerGBFor30Days, getTranscodingCostPerMB } from "../controllers/cost.controller";
const costRouter=Router();

costRouter
    .get("/details",getCostDetailsInRupees)
    .get("/transcoding-cost-per-mb",getTranscodingCostPerMB)
    .get("/hosting-cost-per-30-days",getHostingCostPer30Days)
    .get("/object-storage-cost-per-gb-for-30-days",getObjectStorageCostPerGBFor30Days)


export default costRouter;