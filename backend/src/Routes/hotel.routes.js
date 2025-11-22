import { Router } from "express";
import { createHotel, getMyHotels, updateHotel, deleteHotel } from "../controller/hotel.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(verifyRole(["hotel_owner", "admin"]), upload.single("image"), createHotel);
router.route("/my-hotels").get(verifyRole(["hotel_owner", "admin"]), getMyHotels);
router.route("/:hotelId")
    .patch(verifyRole(["hotel_owner", "admin"]), updateHotel)
    .delete(verifyRole(["hotel_owner", "admin"]), deleteHotel);

export default router;
