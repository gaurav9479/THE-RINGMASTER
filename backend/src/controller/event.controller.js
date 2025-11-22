import Event from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { uploadOnImageKit } from "../utils/imagekit.js";

const createEvent = asynchandler(async (req, res) => {
    const { city, place, type, duration, bestTimeToVisit, description } = req.body;

    if ([city, place, type, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let imageLocalPath;
    if (req.file && req.file.path) {
        imageLocalPath = req.file.path;
    }

    const image = await uploadOnImageKit(imageLocalPath);

    const event = await Event.create({
        city,
        place,
        type,
        duration,
        image: image?.url || "",
        bestTimeToVisit,
        description,
        organizer: req.user._id
    });

    if (!event) {
        throw new ApiError(500, "Something went wrong while creating the event");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, event, "Event created successfully"));
});

const getMyEvents = asynchandler(async (req, res) => {
    const events = await Event.find({ organizer: req.user._id });
    return res
        .status(200)
        .json(new ApiResponse(200, events, "Events fetched successfully"));
});

const updateEvent = asynchandler(async (req, res) => {
    const { eventId } = req.params;
    const { city, place, type, duration, image, bestTimeToVisit, description } = req.body;

    const event = await Event.findOneAndUpdate(
        { _id: eventId, organizer: req.user._id },
        {
            $set: {
                city,
                place,
                type,
                duration,
                image,
                bestTimeToVisit,
                description
            }
        },
        { new: true }
    );

    if (!event) {
        throw new ApiError(404, "Event not found or you are not authorized to update it");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event updated successfully"));
});

const deleteEvent = asynchandler(async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOneAndDelete({ _id: eventId, organizer: req.user._id });

    if (!event) {
        throw new ApiError(404, "Event not found or you are not authorized to delete it");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Event deleted successfully"));
});

export {
    createEvent,
    getMyEvents,
    updateEvent,
    deleteEvent
};
