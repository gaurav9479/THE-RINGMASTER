import express, { Router } from "express"
import { getwheatherDetails } from "../controller/wheather.controller.js"
const router=Router()
router.route("/").get(getwheatherDetails);
export default router
