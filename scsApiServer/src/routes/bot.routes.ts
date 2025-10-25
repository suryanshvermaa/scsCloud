import { Router } from "express";
import { authMiddleware } from "../middleware/middleware";
import { chat } from "../controllers/bot.controller";

const botRouter= Router();
botRouter.post("/chat", authMiddleware, chat);
export default botRouter;