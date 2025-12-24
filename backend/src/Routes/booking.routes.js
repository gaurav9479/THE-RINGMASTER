import { Router } from "express";
import {
    createBooking,
    getUserBookings,
    getVendorBookings
} from "../controller/booking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create", createBooking);
router.get("/user", getUserBookings);
router.get("/vendor", getVendorBookings);

export default router;
