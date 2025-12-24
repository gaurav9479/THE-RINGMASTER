import Booking from "../models/booking.model.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createBooking = asynchandler(async (req, res) => {
    const { itemId, itemType, totalPrice } = req.body;

    if (!itemId || !itemType || !totalPrice) {
        throw new ApiError(400, "All fields are required");
    }

    const booking = await Booking.create({
        user: req.user._id,
        item: itemId,
        itemType,
        totalPrice,
        status: 'Confirmed'
    });

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Booking created successfully"));
});

const getUserBookings = asynchandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('item')
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "User bookings fetched successfully"));
});

const getVendorBookings = asynchandler(async (req, res) => {
    // This is a bit complex as we need to find bookings where the item belongs to the vendor
    // For now, we'll fetch all bookings and filter by comparing the item's owner/organizer
    // In a more optimized version, we'd use aggregations or separate models

    const allBookings = await Booking.find()
        .populate('item')
        .sort("-createdAt");

    const vendorBookings = allBookings.filter(booking => {
        if (!booking.item) return false;
        const ownerId = booking.item.owner || booking.item.organizer;
        return ownerId && ownerId.toString() === req.user._id.toString();
    });

    return res
        .status(200)
        .json(new ApiResponse(200, vendorBookings, "Vendor bookings fetched successfully"));
});

export {
    createBooking,
    getUserBookings,
    getVendorBookings
};
