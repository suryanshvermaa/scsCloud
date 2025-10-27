import Groq from "groq-sdk";
import "dotenv/config"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(messages: Groq.Chat.Completions.ChatCompletionMessageParam[]) {
return await groq.chat.completions.create({
    messages: messages,
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    tool_choice: "auto",
    tools: [
        {
            type: "function",
            function: {
                name: "getOverview",
                description: "Provides a high-level overview of SCS Cloud features and quick links to documentation (HLS Transcoder, Static Website Hosting, and docs shortcuts)."
            }
        },
        {
            type: "function",
            function: {
                name: "getStaticHostingOverview",
                description: "Explains Static Website Hosting on SCS Cloud: deploy static apps (React/Vite) and serve via CDN, typical flow and benefits."
            }
        },
        {
            type: "function",
            function: {
                name: "getStaticHostingSteps",
                description: "Lists step-by-step instructions to prepare and deploy a static site to SCS Cloud hosting (Vite/CRA build hints, routing guidance, upload)."
            }
        },
        {
            type: "function",
            function: {
                name: "getViteConfigSnippet",
                description: "Returns a Vite config snippet (vite.config.ts) with base: './' and React plugin example for deploying static sites."
            }
        },
        {
            type: "function",
            function: {
                name: "getCRAPackageJsonSnippet",
                description: "Returns the relevant package.json snippet for Create React App showing the homepage field set to './' and related notes."
            }
        },
        {
            type: "function",
            function: {
                name: "getReactRouterCatchAllSnippet",
                description: "Provides a react-router-dom catch-all route example to ensure client-side routing works with static hosting (Route '*')."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsOverview",
                description: "Explains the HLS Transcoder: converts a 1080p input into multiple renditions (1080p/720p/480p/360p) and produces a master.m3u8 for adaptive streaming."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsSteps",
                description: "Provides console usage steps for the HLS Transcoder (AWS IAM/credentials, selecting source, required fields, uploading to S3)."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsSdkInstall",
                description: "Returns the Node.js install command for the SCS HLS Transcoder SDK (npm install scs-hls-transcoder)."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsImports",
                description: "Provides example import snippets for the HLS Transcoder SDK in CommonJS and ESM formats."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsUploadExample",
                description: "Shows a pseudocode example for obtaining an upload URL and uploading a video file to S3 using the SDK's VideoUploadUrl response."
            }
        },
        {
            type: "function",
            function: {
                name: "getHlsTranscodingExample",
                description: "Provides a pseudocode example demonstrating starting a transcoding job with the TranscodingVideo function and typical parameters (apiKey, fileName, bucket, AWS keys)."
            }
        },{
            type: "function",
            function: {
                name: "getObjectStorageApiSetupNodejs",
                description: "Provides a Node.js code snippet to set up the S3Client from AWS SDK for interacting with SCS Object Storage.",
            }
        },{
            type: "function",
            function: {
                name: "objectStorageOverview",
                description: "Explains the Object Storage API: programmatically interact with SCS Object Storage using S3-compatible SDKs for operations like upload, download, and management of objects.",
            }
        }
    ]
});
}
