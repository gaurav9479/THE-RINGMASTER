import mongoose from "mongoose";
import TravelStory from "./travelStory.model.js";

const storyCommentSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelStory',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Indexes for efficient queries
storyCommentSchema.index({ story: 1, createdAt: -1 });
storyCommentSchema.index({ author: 1 });

// Update story's commentsCount after save
storyCommentSchema.post('save', async function() {
    const count = await this.constructor.countDocuments({ story: this.story });
    await TravelStory.findByIdAndUpdate(this.story, { commentsCount: count });
});

// Update story's commentsCount after delete
storyCommentSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const count = await mongoose.model('StoryComment').countDocuments({ story: doc.story });
        await TravelStory.findByIdAndUpdate(doc.story, { commentsCount: count });
    }
});

const StoryComment = mongoose.model("StoryComment", storyCommentSchema);
export default StoryComment;
