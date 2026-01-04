import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: String,
    city: String,
    address: String,
    price_per_night: Number,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    image: String,
    amenities: [String],
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

// Database indexes for performance
hotelSchema.index({ city: 1 });
hotelSchema.index({ address: 'text', name: 'text' });
hotelSchema.index({ owner: 1 });
hotelSchema.index({ city: 1, price_per_night: 1 });
hotelSchema.index({ rating: -1 });

export default mongoose.model("Hotel", hotelSchema);