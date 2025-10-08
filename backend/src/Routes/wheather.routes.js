import express, { Router } from "express"
import {getWeatherForecast} from"../controller/wheather.controller.js"
const router=Router()
router.route("/forecast").get(getWeatherForecast);
export default router
