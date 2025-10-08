import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoutes from "./Routes/user.routes.js"
import weatherRoutes from "./Routes/wheather.routes.js"
import TravelRoutes from "./Routes/map.routes.js"
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/weather",weatherRoutes);
app.use("/api/v1/route",TravelRoutes);



export {app}