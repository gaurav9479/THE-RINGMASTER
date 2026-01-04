import { Router } from "express";
import { getTravelRoute } from "../controller/map.controller.js";

const router = Router()
// Changed from POST to GET - fetching route info is a read operation
router.route("/route").get(getTravelRoute)
export default router