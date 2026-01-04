import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createReview,
    getItemReviews,
    updateReview,
    deleteReview,
    markHelpful,
    getUserReviews
} from "../controller/review.controller.js";

const router = Router();

// Public routes
router.get("/item/:itemId", getItemReviews);

// Protected routes
router.use(verifyJWT);

router.post("/", createReview);
router.get("/my-reviews", getUserReviews);
router.patch("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);
router.post("/:reviewId/helpful", markHelpful);

export default router;
