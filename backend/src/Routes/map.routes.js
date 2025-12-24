import { Router } from "express";
import { getTravelRoute } from "../controller/map.controller.js";

const router = Router()
router.route("/route").post(getTravelRoute)
export default router