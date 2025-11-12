import { Router } from "express";
import { deleteDeployment, deployContainer, getDeployments } from "../controllers/deployment.controller";
import { authMiddleware } from "../middleware/middleware";
const deploymentRouter=Router();

deploymentRouter
.get('/getDeployments/:AuthCookie',getDeployments)
.post('/createDeployment',deployContainer)
.delete('/deleteDeployment',authMiddleware,deleteDeployment)

export default deploymentRouter;