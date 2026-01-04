import Hotel from "../models/hotel.model.js";
import Resturant from "../models/resturant.model.js"
import Event from "../models/event.model.js"
import axios from "axios"
import { asynchandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Escape special regex characters to prevent NoSQL injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const searchCity = asynchandler(async (req, res) => {
    const { destination } = req.query;
    if (!destination) {
        throw new ApiError(400, "Destination name required");
    }

    // Sanitize input to prevent NoSQL injection
    const sanitizedDestination = escapeRegex(destination.trim());

    const [hotels, resturant, events] = await Promise.all([
        Hotel.find({ address: { $regex: sanitizedDestination, $options: "i" } }).lean(),
        Resturant.find({ address: { $regex: sanitizedDestination, $options: "i" } }).lean(),
        Event.find({ city: { $regex: sanitizedDestination, $options: "i" } }).lean(),
    ])
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${process.env.OPEN_WHEATHER_API_KEY}&units=metric`;
    const { data: weather } = await axios.get(weatherUrl)
    const resultData = {
        destination,
        results: {
            hotels: hotels.length,
            restaurant: resturant.length,
            events: events.length,
        },
        data: {
            hotels,
            resturant,
            events,
            weather,
        },
    };
    return res
    .status(200)
    .json(new ApiResponse(200,resultData,`search result for ${destination}`))
})