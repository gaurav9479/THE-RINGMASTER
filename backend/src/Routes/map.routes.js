import { Router } from "express";
import { getTravelRoute } from "../controller/map.controller.js";

const router=Router()
router.route("/Maps").get(getTravelRoute)
export default router