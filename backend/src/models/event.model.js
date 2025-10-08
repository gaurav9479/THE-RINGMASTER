import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    startDate: Date,
    endDate: Date,
    type: String,
    link: String
}, { timestamps: true });
export default mongoose.model("Events",eventSchema)