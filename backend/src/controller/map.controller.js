
import axios from "axios";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const OSRM_SERVER = "http://router.project-osrm.org";

export const getTravelRoute = asynchandler(async (req, res) => {
    // Read from query for GET requests
    const { origin, destination, mode } = req.query;


    if (!origin || !destination) {
        throw new ApiError(400, "Origin and destination are required");
    }


    const geocode = async (place) => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
        try {
            const { data } = await axios.get(url, {
                headers: { "User-Agent": "RingmasterApp/1.0" },
            });
            if (!data?.length) throw new ApiError(404, `Location not found: ${place}`);
            return { lat: data[0].lat, lon: data[0].lon };
        } catch (err) {
            throw new ApiError(400, `Geocoding failed for "${place}"`);
        }
    };

    const originCoords = await geocode(origin);
    const destCoords = await geocode(destination);



    const osrmMode = mode || "driving";
    const routeUrl = `${OSRM_SERVER}/route/v1/${osrmMode}/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;

    let routeData;
    try {
        const { data } = await axios.get(routeUrl);
        routeData = data;
    } catch (err) {
        console.error(err.message);
        throw new ApiError(500, "Failed to fetch route from OSRM");
    }

    if (!routeData.routes?.length) {
        throw new ApiError(400, "No route found between the given locations");
    }

    const route = routeData.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(2);
    const durationHrs = (route.duration / 3600).toFixed(2);

    const response = {
        origin,
        destination,
        mode: osrmMode,
        distance: `${distanceKm} km`,
        duration: `${durationHrs} hrs`,
    };

    return res.status(200).json(new ApiResponse(200, response, "Route fetched successfully"));
});
