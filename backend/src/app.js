import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
const app = express()
dotenv.config()
app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : (process.env.CORS_ORIGIN || "http://localhost:5173"),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRoutes from "./Routes/user.routes.js"
import weatherRoutes from "./Routes/wheather.routes.js"
import TravelRoutes from "./Routes/map.routes.js"
import cityRoutes from "./Routes/search.routes.js"
import hotelRoutes from "./Routes/hotel.routes.js"
import eventRoutes from "./Routes/event.routes.js"
import aiRoutes from "./Routes/ai.routes.js"
import bookingRoutes from "./Routes/booking.routes.js"
import reviewRoutes from "./Routes/review.routes.js"
import adminRoutes from "./Routes/admin.routes.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/weather", weatherRoutes);  // Fixed typo: wheather -> weather
app.use("/api/v1/wheather", weatherRoutes); // Keep old route for backward compatibility
app.use("/api/v1/map", TravelRoutes);
app.use("/api/v1/search", cityRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin", adminRoutes);

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error for debugging (replace with proper logger in production)
    console.error(`[ERROR] ${statusCode}: ${message}`, err.stack);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export { app }