import { Router } from "express";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";
import {
    // Dashboard & Analytics
    getDashboardStats,
    getUserGrowthAnalytics,
    // User Management
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserSuspension,
    deleteUser,
    // Content Moderation
    getReviewsForModeration,
    adminDeleteReview,
    getHotelsForModeration,
    adminDeleteHotel,
    getEventsForModeration,
    adminDeleteEvent
} from "../controller/admin.controller.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT);
router.use(verifyRole(['admin']));

// Dashboard & Analytics
router.get("/dashboard", getDashboardStats);
router.get("/analytics/growth", getUserGrowthAnalytics);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/role", updateUserRole);
router.patch("/users/:userId/suspend", toggleUserSuspension);
router.delete("/users/:userId", deleteUser);

// Content Moderation - Reviews
router.get("/moderation/reviews", getReviewsForModeration);
router.delete("/moderation/reviews/:reviewId", adminDeleteReview);

// Content Moderation - Hotels
router.get("/moderation/hotels", getHotelsForModeration);
router.delete("/moderation/hotels/:hotelId", adminDeleteHotel);

// Content Moderation - Events
router.get("/moderation/events", getEventsForModeration);
router.delete("/moderation/events/:eventId", adminDeleteEvent);

export default router;
