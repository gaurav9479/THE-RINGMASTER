import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/AsyncHandler";

const getwheatherDetails=asynchandler(async(req,res)=>{
    const {city}=req.query;
    if(!city || city.trim()===''){
        throw new ApiError(400,"city name is required")
    }
    const mapurl= `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    city)}&format=json&limit=1`;
    const mapresponse= await axios.get(mapurl);
    if(!mapresponse.data.length){
        throw new ApiError(404,"city not found")

    }
    const {lat,lon}=mapresponse.data[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    const wheatherResponse=await axios.get(weatherUrl);
    const data=wheatherResponse.data;
    return res.status(200).json(
    new ApiResponse(
        200,
        {
        city: city,
        coordinates: { lat, lon },
        forecast: data.list.slice(0, 5).map((item) => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            weather: item.weather[0].description,
        })),
        },
        "Weather details fetched successfully"
    )
  );
})
export {getwheatherDetails}