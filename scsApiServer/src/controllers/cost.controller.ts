import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import "dotenv/config";
import response from "../utils/response";

/**
 * @description Get cost details in rupees
 * @param req Request object
 * @param res Response object
 */
export const getCostDetailsInRupees = asyncHandler(async (req: Request, res: Response) => {
    const costDetails ={
        transcodingCostPerMBinRupees: process.env.TRANSCODER_SERVICE_CHARGE,
        hostingCostPer30DaysInRupees: process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS,
        objectStorageCostPerGBInRupeesFor30Days: process.env.OBJECT_STORAGE_COST_PER_GB,
    }
    response(res, 200, "Cost details fetched successfully", costDetails);
});

/**
 * @description Get transcoding cost per MB
 * @param req Request object
 * @param res Response object
 */
export const getTranscodingCostPerMB = asyncHandler(async (req: Request, res: Response) => {
    response(res, 200, "Transcoding cost per MB fetched successfully", {
        transcodingCostPerMBinRupees: process.env.TRANSCODER_SERVICE_CHARGE,
    });
});

/**
 * @description Get hosting cost per 30 days
 * @param req Request object
 * @param res Response object
 */
export const getHostingCostPer30Days = asyncHandler(async (req: Request, res: Response) => {
    response(res, 200, "Hosting cost per 30 days fetched successfully", {
        hostingCostPer30DaysInRupees: process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS,
    });
});

/**
 * @description Get object storage cost per GB for 30 days
 * @param req Request object
 * @param res Response object
 */
export const getObjectStorageCostPerGBFor30Days = asyncHandler(async (req: Request, res: Response) => {
    response(res, 200, "Object storage cost per GB for 30 days fetched successfully", {
        objectStorageCostPerGBInRupeesFor30Days: process.env.OBJECT_STORAGE_COST_PER_GB,
    });
}); 