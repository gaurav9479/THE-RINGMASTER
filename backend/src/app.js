import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
const app = express()
dotenv.config()
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl)
        if (!origin) return callback(null, true);
        const envOrigin = process.env.CORS_ORIGIN;
        // If wildcard configured, allow all
        if (envOrigin === "*") return callback(null, true);
        // Support comma-separated allowed origins
        const allowed = (envOrigin || "http://localhost:5173,http://localhost:5174")
            .split(",")
            .map(o => o.trim());
        // Also allow any localhost http(s) port during dev
        const isLocalhost = /^https?:\/\/localhost:\d{2,5}$/.test(origin);
        if (allowed.includes(origin) || isLocalhost) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
import travelStoryRoutes from "./Routes/travelStory.routes.js"

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
app.use("/api/v1/travel-stories", travelStoryRoutes);

// Lightweight health endpoint for uptime checks
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

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