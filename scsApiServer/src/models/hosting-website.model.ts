import mongoose,{Document,Schema} from "mongoose";

export interface IHosting extends Document{
    websiteUrl:string;
    user:object | string;
    s3bucketUrl:string;
    websiteName:string;
    validDate:Date;
    websiteType:string;
}

const websiteSchema:Schema<IHosting>=new Schema({
    websiteUrl:{
        type:String,
        required:true,
        unique:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    s3bucketUrl:{
        type:String,
        required:true,
        select:false
    },
    websiteName:{
        type:String,
        required:true,
    },
    validDate:{
        type:Date,
        required:true
    
    },
    websiteType:{
        type:String,
        required:true
    }
},{timestamps:true})

const Website=mongoose.model('Website',websiteSchema);
export default Website;