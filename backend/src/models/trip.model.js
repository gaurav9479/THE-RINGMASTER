import mongoose from "mongoose";


const tripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    weatherForecast: { type: Object },
    travelRoute: { type: Object },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    budget: { type: Object },
    itinerary: { type: Array }
}, { timestamps: true });

export default mongoose.model("trip",tripSchema);