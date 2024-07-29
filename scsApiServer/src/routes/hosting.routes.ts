import { Router } from "express";
import { getWebsites, hostWebsite, renewValidity } from "../controllers/hosting.service.controller";
const hostingRouter=Router();

hostingRouter
.post('/host-website',hostWebsite)
.get('/websites',getWebsites)
.post('/renew-validity',renewValidity)

export default hostingRouter;