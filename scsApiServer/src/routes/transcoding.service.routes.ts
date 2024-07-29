import { Router } from "express";
import { authMiddleware } from "../middleware/middleware";
import { transcodeVideo, uploadVideoUrl } from "../controllers/hlsTranscoding.service.controller";
const transcodingRouter=Router();

transcodingRouter
.post('/upload-video',authMiddleware,uploadVideoUrl)
.post('/transcoding-video',authMiddleware,transcodeVideo)

export default transcodingRouter;