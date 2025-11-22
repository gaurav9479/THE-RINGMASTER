import { Router } from "express";
import { createEvent, getMyEvents, updateEvent, deleteEvent } from "../controller/event.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(verifyRole(["event_organizer", "admin"]), upload.single("image"), createEvent);
router.route("/my-events").get(verifyRole(["event_organizer", "admin"]), getMyEvents);
router.route("/:eventId")
    .patch(verifyRole(["event_organizer", "admin"]), updateEvent)
    .delete(verifyRole(["event_organizer", "admin"]), deleteEvent);

export default router;
