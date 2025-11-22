import { Router } from "express";
import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || "http://localhost:8000";

router.post("/plan", verifyJWT, asynchandler(async (req, res) => {
    const { destination, days } = req.body;

    if (!destination) {
        throw new ApiError(400, "Destination is required");
    }

    try {
        const response = await axios.post(`${PYTHON_AGENT_URL}/plan-trip`, {
            destination,
            days: days || 3 // Default to 3 days
        });

        return res
            .status(200)
            .json(new ApiResponse(200, response.data, "Trip plan generated successfully"));
    } catch (error) {
        console.error("Python Agent Error:", error.message);
        throw new ApiError(500, "Failed to generate trip plan via AI Agent");
    }
}));

export default router;
