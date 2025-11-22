import Hotel from "../models/hotel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { uploadOnImageKit } from "../utils/imagekit.js";

const createHotel = asynchandler(async (req, res) => {
    const { name, city, address, price_per_night, description, amenities } = req.body;

    if ([name, city, address, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let imageLocalPath;
    if (req.file && req.file.path) {
        imageLocalPath = req.file.path;
    }

    const image = await uploadOnImageKit(imageLocalPath);

    const hotel = await Hotel.create({
        name,
        city,
        address,
        price_per_night,
        description,
        amenities,
        image: image?.url || "",
        owner: req.user._id
    });

    if (!hotel) {
        throw new ApiError(500, "Something went wrong while creating the hotel");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, hotel, "Hotel created successfully"));
});

const getMyHotels = asynchandler(async (req, res) => {
    const hotels = await Hotel.find({ owner: req.user._id });
    return res
        .status(200)
        .json(new ApiResponse(200, hotels, "Hotels fetched successfully"));
});

const updateHotel = asynchandler(async (req, res) => {
    const { hotelId } = req.params;
    const { name, city, address, price_per_night, description, amenities, image } = req.body;

    const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId, owner: req.user._id },
        {
            $set: {
                name,
                city,
                address,
                price_per_night,
                description,
                amenities,
                image
            }
        },
        { new: true }
    );

    if (!hotel) {
        throw new ApiError(404, "Hotel not found or you are not authorized to update it");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, hotel, "Hotel updated successfully"));
});

const deleteHotel = asynchandler(async (req, res) => {
    const { hotelId } = req.params;

    const hotel = await Hotel.findOneAndDelete({ _id: hotelId, owner: req.user._id });

    if (!hotel) {
        throw new ApiError(404, "Hotel not found or you are not authorized to delete it");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Hotel deleted successfully"));
});

export {
    createHotel,
    getMyHotels,
    updateHotel,
    deleteHotel
};
