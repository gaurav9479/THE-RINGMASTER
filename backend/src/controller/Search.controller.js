import Hotel from "../models/hotel.model.js";
import Resturant from "../models/resturant.model.js"
import Event from "../models/event.model.js"
import axios from "axios"
import { asynchandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const searchCity = asynchandler(async (req, res) => {
    const { destination } = req.query;
    if (!destination) {
        throw new ApiError(400, "Destination name required");
    }
    const [hotels, resturant, events] = await Promise.all([
        Hotel.find({ address: { $regex: destination, $options: "i" } }),
        Resturant.find({ address: { $regex: destination, $options: "i" } }),
        Event.find({ city: { $regex: destination, $options: "i" } }),
    ])
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${process.env.OPEN_WHEATHER_API_KEY}&units=metric`;
    const { data: weather } = await axios.get(weatherUrl)
    const resultData = {
        destination,
        results: {
            hotels: hotels.length,
            restaurants: resturant.length,
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