import { Router } from "express";
import { chat } from "../controllers/bot.controller";

const botRouter= Router();
botRouter.post("/chat", chat);
export default botRouter;