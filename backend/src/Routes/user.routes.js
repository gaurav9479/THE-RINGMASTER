import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/user.validation.js";

const router = Router();

// Rate limiting for auth endpoints to prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: "Too many attempts, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting and validation to auth routes
router.route("/register").post(
    authLimiter,
    validate(registerSchema),
    registerUser
);

router.route("/login").post(
    authLimiter,
    validate(loginSchema),
    loginUser
);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;