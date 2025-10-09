import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    city: String,
    place: String,
    type: String,
    duration: String,
    image: String,
    bestTimeToVisit: String,
    description: String,
}, { timestamps: true });
export default mongoose.model("Events",eventSchema)