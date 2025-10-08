
import axios from "axios";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getTravelRoute = asynchandler(async (req, res) => {
    const { origin, destination, mode } = req.body;


    if (!origin || !destination) {
    throw new ApiError(400, "Origin and destination are required");
    }

    const apiKey = process.env.OPEN_ROUTE_API_KEY;


    const geocode = async (place) => {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
        place
    )}`;
    try {
        const { data } = await axios.get(url);
        if (!data.features?.length) throw new Error("Location not found");
        const [lon, lat] = data.features[0].geometry.coordinates;
        return { lat, lon };
    } catch (err) {
        throw new ApiError(400, `Geocoding failed for: ${place}`);
    }
    };

    const originCoords = await geocode(origin);
    const destCoords = await geocode(destination);


    const routeUrl = `https://api.openrouteservice.org/v2/directions/${
    mode || "driving-car"
    }?api_key=${apiKey}&start=${originCoords.lon},${originCoords.lat}&end=${destCoords.lon},${destCoords.lat}`;

    let routeData;
    try {
    const { data } = await axios.get(routeUrl);
    routeData = data;
    } catch (error) {
    console.error(error.response?.data || error.message);
    throw new ApiError(500, "Failed to fetch route from OpenRouteService API");
    }

    if (!routeData?.routes?.length) {
    throw new ApiError(400, "No route found between the given locations");
    }

    const route = routeData.routes[0];
    const distanceKm = (route.summary.distance / 1000).toFixed(2);
    const durationHrs = (route.summary.duration / 3600).toFixed(2);

    const response = {
    origin,
    destination,
    mode: mode || "driving-car",
    distance: `${distanceKm} km`,
    duration: `${durationHrs} hrs`,
    };

    return res
    .status(200)
    .json(new ApiResponse(200, response, "Route details fetched successfully"));
});
