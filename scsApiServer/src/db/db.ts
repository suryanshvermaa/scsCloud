import mongoose from "mongoose";

export const dbConnect=async()=>{
    try {
        const url=process.env.MONGO_URI!;
        await mongoose.connect(url);
        console.log('database successfully connected');
    } catch (error:any) {
        console.log(error.message);
    }
}