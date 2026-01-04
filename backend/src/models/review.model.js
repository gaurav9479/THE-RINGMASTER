import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Hotel', 'Restaurant', 'Events']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    images: [String],
    helpful: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Prevent duplicate reviews from the same user for the same item
reviewSchema.index({ user: 1, item: 1 }, { unique: true });

// Indexes for efficient queries
reviewSchema.index({ item: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

// Static method to calculate and update average rating for an item
reviewSchema.statics.calcAverageRating = async function(itemId, itemType) {
    const stats = await this.aggregate([
        { $match: { item: itemId } },
        {
            $group: {
                _id: '$item',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    // Get the appropriate model based on itemType
    const Model = mongoose.model(itemType);

    if (stats.length > 0) {
        await Model.findByIdAndUpdate(itemId, {
            rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
            numReviews: stats[0].numReviews
        });
    } else {
        // No reviews left, reset to defaults
        await Model.findByIdAndUpdate(itemId, {
            rating: 0,
            numReviews: 0
        });
    }
};

// Update average rating after save
reviewSchema.post('save', async function() {
    await this.constructor.calcAverageRating(this.item, this.itemType);
});

// Update average rating after delete
reviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await doc.constructor.calcAverageRating(doc.item, doc.itemType);
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
