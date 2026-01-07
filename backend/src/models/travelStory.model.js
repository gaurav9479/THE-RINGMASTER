import mongoose from "mongoose";

const travelStorySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 10000,
        trim: true
    },
    location: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    },
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <= 10;
            },
            message: 'Cannot upload more than 10 images'
        }
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    visitDate: {
        type: Date
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Indexes for efficient queries
travelStorySchema.index({ author: 1, createdAt: -1 });
travelStorySchema.index({ 'location.city': 1 });
travelStorySchema.index({ 'location.country': 1 });
travelStorySchema.index({ tags: 1 });
travelStorySchema.index({ createdAt: -1 });
travelStorySchema.index({ likesCount: -1 });
travelStorySchema.index({
    title: 'text',
    content: 'text',
    'location.name': 'text'
});

const TravelStory = mongoose.model("TravelStory", travelStorySchema);
export default TravelStory;
