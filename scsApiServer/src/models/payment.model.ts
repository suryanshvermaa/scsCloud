import mongoose,{Document,Schema} from "mongoose";

interface IPayment extends Document{
    paymentId:string;
    orderId:string;
    amount:number;
    userId:object;
    payment_currency:string;
}

const paymentSchema:Schema<IPayment>=new Schema({
    paymentId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    payment_currency:{
        type:String,
        required:true
    }

},{timestamps:true})

const Payment=mongoose.model('Payment',paymentSchema);
export default Payment;