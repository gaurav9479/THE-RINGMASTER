import axios from "axios";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    geocodeCity,
    getOpenMeteoForecast,
    getNwsForecast,
    getOpenWeatherForecastByCity
} from "../utils/weatherProvider.js";


export const getWeatherForecast = asynchandler(async (req, res) => {
    const { destination, startDate, endDate } = req.query;


    if (!destination || !startDate || !endDate) {
        throw new ApiError(400, "Destination, startDate, and endDate are required");
    }

    const provider = (process.env.WEATHER_PROVIDER || "openweather").toLowerCase();
    let formattedForecast = [];
    try {
        if (provider === "openmeteo") {
            const { lat, lon } = await geocodeCity(destination);
            formattedForecast = await getOpenMeteoForecast(lat, lon, startDate, endDate);
        } else if (provider === "nws" || provider === "weather.gov") {
            const { lat, lon } = await geocodeCity(destination);
            const ua = process.env.NWS_USER_AGENT || "RingmasterApp/1.0 (contact@invalid)";
            formattedForecast = await getNwsForecast(lat, lon, startDate, endDate, ua);
        } else {
            const apiKey = process.env.OPEN_WHEATHER_API_KEY;
            if (!apiKey) {
                throw new ApiError(500, "OPEN_WHEATHER_API_KEY missing and WEATHER_PROVIDER not set to openmeteo/nws");
            }
            formattedForecast = await getOpenWeatherForecastByCity(destination, apiKey, startDate, endDate);
        }
    } catch (error) {
        throw new ApiError(500, "Failed to fetch weather data from provider");
    }

    const response = {
        destination,
        startDate,
        endDate,
        forecast: formattedForecast
    };


    return res
        .status(200)
        .json(new ApiResponse(200, response, "Weather forecast fetched successfully"));
});

