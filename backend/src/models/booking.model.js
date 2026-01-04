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
            enum: ['Hotel', 'Restaurant', 'Events'] // Fixed typo: Resturant -> Restaurant
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

// Database indexes for performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ item: 1, itemType: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ user: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
