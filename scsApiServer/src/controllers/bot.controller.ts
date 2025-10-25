import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import { deleteSession, getSession, setSession } from "../bot/sessions";
import { systemPrompt } from "../bot/system_prompt";
import { getGroqChatCompletion } from "../bot";
import jwt from "jsonwebtoken";
import {
    getOverview,
    getStaticHostingOverview,
    getStaticHostingSteps,
    getViteConfigSnippet,
    getCRAPackageJsonSnippet,
    getReactRouterCatchAllSnippet,
    getHlsOverview,
    getHlsSteps,
    getHlsSdkInstall,
    getHlsImports,
    getHlsUploadExample,
    getHlsTranscodingExample,
} from "../bot/functions";
import Groq from "groq-sdk";
import response from "../utils/response";

/**
 * @description Chat endpoint: prioritizes public docs answers; falls back to LLM if needed.
 * @param req request object containing message and sessionId
 * @param res response object to send back the reply
 */
export const chat = asyncHandler(async (req: Request, res: Response) => {
    let { message, sessionId ,AccessCookie} = req.body;
    if (!message || !sessionId ||!AccessCookie) throw new AppError("message and sessionId both required", 400);
    const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid Access Cookie',401);
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    sessionId=sessionId+userId;
    const prevSession=getSession(sessionId);
    if(!prevSession){
        const startingMessage:Groq.Chat.Completions.ChatCompletionMessageParam[]=[
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: message
            }
        ];
        setSession(sessionId,{
            messages:startingMessage
        });
    }
    if(prevSession)  clearTimeout(prevSession?.timeoutHandle);
    const session=getSession(sessionId); 
    session?.messages.push({
        role: "user",
        content: message
    })
    const aiRes=(await getGroqChatCompletion(session!.messages)).choices[0].message;
    const toolCalls=aiRes.tool_calls;
    session!.messages.push(aiRes);
        
    if(toolCalls?.length){
        for(const toolCall of toolCalls){
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionResponse = functionToCall();
            session!.messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                content: functionResponse,
            });
        }
    }
    if(!toolCalls?.length) response(res, 200, "success chat response", { response: aiRes.content });
    const secondAiRes=(await getGroqChatCompletion(session!.messages)).choices[0].message;
    session!.messages.push(secondAiRes);
    const sessionTimeout = setTimeout(() => {
        deleteSession(sessionId);
    }, 15 * 60 * 1000);  // 15 minutes
    session!.timeoutHandle = sessionTimeout;
    response(res,200,"success chat response",{response: secondAiRes.content})
});

export const availableFunctions: Record<string, Function> = {
    "getOverview": getOverview,
    "getStaticHostingOverview": getStaticHostingOverview,
    "getStaticHostingSteps": getStaticHostingSteps,
    "getViteConfigSnippet": getViteConfigSnippet,
    "getCRAPackageJsonSnippet": getCRAPackageJsonSnippet,
    "getReactRouterCatchAllSnippet": getReactRouterCatchAllSnippet,
    "getHlsOverview": getHlsOverview,
    "getHlsSteps": getHlsSteps,
    "getHlsSdkInstall": getHlsSdkInstall,
    "getHlsImports": getHlsImports,
    "getHlsUploadExample": getHlsUploadExample,
    "getHlsTranscodingExample": getHlsTranscodingExample,
} as const;