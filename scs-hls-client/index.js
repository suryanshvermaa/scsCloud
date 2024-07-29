"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscodeVideo = exports.VideoUploadUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const errorObj = { error: 'Invalid credentials or not sufficient amount or error fileName' };
const VideoUploadUrl = (video) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.post('https://api.suryanshverma.site/api/v1/upload-video', { fileName: video.fileName, credentials: video.credentials });
        const responseObj = {
            uploadUrl: res.data.uploadUrl,
            fileName: res.data.fileName
        };
        return responseObj;
    }
    catch (error) {
        return errorObj;
    }
});
exports.VideoUploadUrl = VideoUploadUrl;
const TranscodeVideo = (transcodingProps) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcodingPropsObj = {
            videoKey: `outputs/${transcodingProps.fileName}`,
            userAccessKey: transcodingProps.awsCredentials.accessKey,
            userSecretAccessKey: transcodingProps.awsCredentials.secretAccessKey,
            bucketPath: transcodingProps.bucketPath,
            userBucketName: transcodingProps.bucketName,
            email: transcodingProps.email,
            credentials: transcodingProps.credentials
        };
        const res = yield axios_1.default.post('https://api.suryanshverma.site/api/v1/transcoding-video', { transcodingPropsObj });
        const resP = {
            success: true,
            message: 'transcoding process is queued. when transcoding completes we will notify through email',
            videoPath: `https://s3.<yourregionName>..amazonaws.com/${transcodingProps.bucketName}/${transcodingProps.bucketPath}/outputs/master.m3u8`
        };
        return resP;
    }
    catch (error) {
        const errorP = { error: 'Invalid credentials or not sufficient amount or error fileName' };
        return errorP;
    }
});
exports.TranscodeVideo = TranscodeVideo;
