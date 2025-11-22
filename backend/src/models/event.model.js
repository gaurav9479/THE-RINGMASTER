import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    city: String,
    place: String,
    type: String,
    duration: String,
    image: String,
    bestTimeToVisit: String,
    description: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
export default mongoose.model("Events", eventSchema)