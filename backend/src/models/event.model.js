import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    city: String,
    place: String,
    type: String,
    duration: String,
    image: String,
    bestTimeToVisit: String,
    description: String,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

// Database indexes for performance
eventSchema.index({ city: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ place: 'text', description: 'text' });

export default mongoose.model("Events", eventSchema);