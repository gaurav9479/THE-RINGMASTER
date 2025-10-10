import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: String,
    city: String,
    address: String,
    price_per_night: Number,
    rating: Number,
    image: String,
    amenities: [String],
    description: String,
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);