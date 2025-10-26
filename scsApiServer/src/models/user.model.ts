import mongoose,{Document,Schema} from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    SCSCoins:number;
    comparePassword:(password:string)=>Promise<boolean>;
    isAdmin:boolean;
    refreshToken:string;
    paymentCount:number;
    paymentAmount:number;
    credentialsActive:boolean;
    accessKey:string;
    secretAccessKey:string;
    objectStorageServiceEnabled:boolean;
}
const userSchema:Schema<IUser>=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    SCSCoins:{
        type:Number,
        default:0
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },paymentCount:{
        type:Number,
        default:0
    },
    paymentAmount:{
        type:Number,
        default:0
    },
     accessKey:{
        type:String,
        default:''
    },
    secretAccessKey:{
         type:String,
         default:''
     },
     credentialsActive:{
        type:Boolean,
        default:false
     },
     objectStorageServiceEnabled:{
        type:Boolean,
        default:false
     },
},{timestamps:true})

userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')) next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword=async function(enteredPassword:string){
    return await bcrypt.compare(enteredPassword,this.password);
}
const User=mongoose.model("User",userSchema);
export default User;