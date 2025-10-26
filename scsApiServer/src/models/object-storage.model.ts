import mongoose,{Document,Schema} from "mongoose";

interface IObjectStorage extends Document{
    userId:object;
    accessKey:string;
    secretAccessKey:string;
    storageInGB:number;
    expiryDate:Date;
    storageEndpoint:string;
    service: string;
}

const objectStorageSchema:Schema<IObjectStorage>=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    accessKey:{
        type:String,
        required:true
    },
    secretAccessKey:{
        type:String,
        required:true
    },
    storageInGB:{
        type:Number,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    storageEndpoint:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true,
    }
},{timestamps:true})

const ObjectStorage=mongoose.model('ObjectStorage',objectStorageSchema);
export default ObjectStorage;