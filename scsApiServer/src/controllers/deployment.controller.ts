import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import { GetDeployments, DeployContainer, DeleteDeployment } from "../services/gRPC/gRPC.service";
import "dotenv/config";
import jwt from "jsonwebtoken";
import response from "../utils/response";
import { Deployment } from "../../pb/containerService/Deployment";

/**
 * @description Controller to get all deployments
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const getDeployments = asyncHandler(async (req: Request, res: Response) => {
    const AuthCookie = req.params.AuthCookie;
    if(!AuthCookie) throw new AppError("Authentication cookie is required", 400);
    const isVerified = await jwt.verify(AuthCookie,process.env.ACCESS_TOKEN_SECRET!);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if(!isVerified) throw new AppError("Invalid Authentication Cookie", 401);
    const deployments: Deployment[]|undefined = await GetDeployments(userId);
    if(!deployments) throw new AppError("Could not fetch deployments", 500);
    for (const deployment of deployments) {
        (deployment as any).url = `http://${(deployment as Deployment).serviceSubdomain}.${process.env.HOSTING_DOMAIN}`;
    }
    response(res, 200, "Deployments fetched successfully", { deployments });
});

/**
 * @description Controller to deploy a new container
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const deployContainer = asyncHandler(async (req: Request, res: Response) => {
    const { AuthCookie, config } = req.body;
    if(!AuthCookie) throw new AppError("Authentication cookie is required", 400);
    if(!config || !config.dockerImage) throw new AppError("Deployment configuration with dockerImage and serviceSubdomain is required", 400);
    const isVerified = await jwt.verify(AuthCookie,process.env.ACCESS_TOKEN_SECRET!);
    const { userId } = JSON.parse(JSON.stringify(isVerified));
    if(!isVerified) throw new AppError("Invalid Authentication Cookie", 401);
    const deploymentConfig:Deployment = {
        cpu: config?.cpu || 0.5,
        dockerImage: config.dockerImage,
        environments: config?.environments || [],
        memory: config?.memory || 512,
        name: config?.name || `service-${Math.random().toString(36).substring(7)}`,
        namespace: "container-service",
        port: config?.port || 80,
        replicas: config?.replicas || 1,
        serviceSubdomain: config?.serviceSubdomain || `service-${Math.random().toString(36).substring(7)}`
    }
    const deploymentResult:Deployment|undefined = await DeployContainer(userId, deploymentConfig);
    response(res, 200, "Container deployed successfully", { deploymentResult,url: `http://${deploymentConfig.serviceSubdomain}.${process.env.HOSTING_DOMAIN}` });
});

/**
 * @description Controller to delete a deployment
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const deleteDeployment = asyncHandler(async (req: Request, res: Response) => {
    const { deploymentId } = req.body;
    if(!deploymentId) throw new AppError("Deployment ID is required", 400);
    await DeleteDeployment(deploymentId);
    response(res, 200, "Deployment deleted successfully",{});
});