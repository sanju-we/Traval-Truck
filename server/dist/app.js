import express from "express";
import userRouter from "./routes/userRouters.js";
import cors from 'cors';
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();
// middle wares 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(morgan("dev"));
app.use('/api/user', userRouter);
export function createApp() {
    return app;
}
