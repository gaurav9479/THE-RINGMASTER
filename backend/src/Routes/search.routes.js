import { Router } from "express";
import { searchCity } from "../controller/Search.controller.js";
const router=Router()
router.route('/city').get(searchCity)
export default router