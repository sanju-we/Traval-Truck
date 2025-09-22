import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()
export const connectDB = async()=>{
  try {
    console.log("fdsvsd",process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI as string );
    console.log("Database connected")
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
