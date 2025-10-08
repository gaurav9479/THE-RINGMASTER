import axios from "axios";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getWeatherForecast = asynchandler(async (req, res) => {
    const { destination, startDate, endDate } = req.body;


    if (!destination || !startDate || !endDate) {
    throw new ApiError(400, "Destination, startDate, and endDate are required");
    }


    const apiKey = process.env.OPEN_WHEATHER_API_KEY; // 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${apiKey}&units=metric`;

    let weatherData;
    try {
    const { data } = await axios.get(apiUrl);
    weatherData = data;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch weather data from API");
    }


    const forecast = weatherData.list.filter((entry) => {
    const entryDate = new Date(entry.dt_txt);
    return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });


    const formattedForecast = forecast.map((f) => ({
    date: f.dt_txt,
    temperature: f.main.temp,
    humidity: f.main.humidity,
    weather: f.weather[0].description,
    }));

    const response = {
    destination,
    startDate,
    endDate,
    forecast: formattedForecast,
    };


    return res
    .status(200)
    .json(new ApiResponse(200, response, "Weather forecast fetched successfully"));
});

