import "reflect-metadata";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

dotenv.config()
const app = createApp();
const port = process.env.PORT || 5000

connectDB().then(()=>{
  app.listen(port,()=>console.log(`Server running on http://localhost:${port}`))
})
