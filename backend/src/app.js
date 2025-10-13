import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
const app=express()
dotenv.config()
app.use(cors({
    origin:process.env.CORS_ORIGIN||"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials:true

}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoutes from "./Routes/user.routes.js"
import weatherRoutes from "./Routes/wheather.routes.js"
import TravelRoutes from "./Routes/map.routes.js"
import cityRoutes from "./Routes/search.routes.js"
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/weather",weatherRoutes);
app.use("/api/v1/route",TravelRoutes);
app.use("/api/v1/search",cityRoutes);



export {app}