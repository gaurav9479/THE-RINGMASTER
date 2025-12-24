import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        item: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'itemType'
        },
        itemType: {
            type: String,
            required: true,
            enum: ['Hotel', 'Resturant', 'Events']
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Confirmed'
        },
        totalPrice: {
            type: Number,
            required: true
        },
        bookingDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
