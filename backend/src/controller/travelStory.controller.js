import TravelStory from "../models/travelStory.model.js";
import StoryComment from "../models/storyComment.model.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { uploadOnImageKit } from "../utils/imagekit.js";

// Create a new travel story
export const createStory = asynchandler(async (req, res) => {
    const { title, content, location, rating, tags, visitDate, isPublished } = req.body;

    // Upload images to ImageKit
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnImageKit(file.path);
            if (uploadedImage && uploadedImage.url) {
                imageUrls.push(uploadedImage.url);
            }
        }
    }

    // Parse location if it's a string
    let parsedLocation = location;
    if (typeof location === 'string') {
        try {
            parsedLocation = JSON.parse(location);
        } catch (e) {
            parsedLocation = { name: location };
        }
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
        try {
            parsedTags = JSON.parse(tags);
        } catch (e) {
            parsedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
    }

    const story = await TravelStory.create({
        author: req.user._id,
        title,
        content,
        location: parsedLocation,
        images: imageUrls,
        rating: rating ? Number(rating) : undefined,
        tags: parsedTags || [],
        visitDate: visitDate ? new Date(visitDate) : undefined,
        isPublished: isPublished !== 'false'
    });

    const populatedStory = await TravelStory.findById(story._id)
        .populate('author', 'fullname UserName');

    return res.status(201).json(
        new ApiResponse(201, populatedStory, "Travel story created successfully")
    );
});

// Get all travel stories (public feed)
export const getAllStories = asynchandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        city,
        country,
        tag,
        search
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Build filter
    const filter = { isPublished: true };

    if (city) {
        filter['location.city'] = new RegExp(city, 'i');
    }
    if (country) {
        filter['location.country'] = new RegExp(country, 'i');
    }
    if (tag) {
        filter.tags = tag.toLowerCase();
    }
    if (search) {
        filter.$text = { $search: search };
    }

    const [stories, total] = await Promise.all([
        TravelStory.find(filter)
            .populate('author', 'fullname UserName')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        TravelStory.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            stories,
            pagination: getPaginationMeta(total, page, limit)
        }, "Stories fetched successfully")
    );
});

// Get a single story by ID
export const getStoryById = asynchandler(async (req, res) => {
    const { storyId } = req.params;

    const story = await TravelStory.findById(storyId)
        .populate('author', 'fullname UserName');

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    // Get comments for this story
    const comments = await StoryComment.find({ story: storyId })
        .populate('author', 'fullname UserName')
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, { story, comments }, "Story fetched successfully")
    );
});

// Get current user's stories
export const getMyStories = asynchandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
        TravelStory.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        TravelStory.countDocuments({ author: req.user._id })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            stories,
            pagination: getPaginationMeta(total, page, limit)
        }, "Your stories fetched successfully")
    );
});

// Update a story
export const updateStory = asynchandler(async (req, res) => {
    const { storyId } = req.params;
    const { title, content, location, rating, tags, visitDate, isPublished } = req.body;

    const story = await TravelStory.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    // Only the author can update
    if (story.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own stories");
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
        const newImageUrls = [];
        for (const file of req.files) {
            const uploadedImage = await uploadOnImageKit(file.path);
            if (uploadedImage && uploadedImage.url) {
                newImageUrls.push(uploadedImage.url);
            }
        }
        // Append new images to existing ones (max 10)
        story.images = [...story.images, ...newImageUrls].slice(0, 10);
    }

    // Parse location if it's a string
    if (location) {
        if (typeof location === 'string') {
            try {
                story.location = JSON.parse(location);
            } catch (e) {
                story.location = { ...story.location, name: location };
            }
        } else {
            story.location = location;
        }
    }

    // Parse tags if provided
    if (tags) {
        if (typeof tags === 'string') {
            try {
                story.tags = JSON.parse(tags);
            } catch (e) {
                story.tags = tags.split(',').map(t => t.trim()).filter(t => t);
            }
        } else {
            story.tags = tags;
        }
    }

    if (title) story.title = title;
    if (content) story.content = content;
    if (rating) story.rating = Number(rating);
    if (visitDate) story.visitDate = new Date(visitDate);
    if (isPublished !== undefined) story.isPublished = isPublished !== 'false';

    await story.save();

    const updatedStory = await TravelStory.findById(storyId)
        .populate('author', 'fullname UserName');

    return res.status(200).json(
        new ApiResponse(200, updatedStory, "Story updated successfully")
    );
});

// Delete a story
export const deleteStory = asynchandler(async (req, res) => {
    const { storyId } = req.params;

    const story = await TravelStory.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    // Only the author or admin can delete
    if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You can only delete your own stories");
    }

    // Delete all comments associated with this story
    await StoryComment.deleteMany({ story: storyId });

    await TravelStory.findByIdAndDelete(storyId);

    return res.status(200).json(
        new ApiResponse(200, null, "Story deleted successfully")
    );
});

// Toggle like on a story
export const toggleLike = asynchandler(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await TravelStory.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    const likeIndex = story.likes.indexOf(userId);

    if (likeIndex > -1) {
        // User already liked, so unlike
        story.likes.splice(likeIndex, 1);
        story.likesCount = story.likes.length;
    } else {
        // User hasn't liked, so add like
        story.likes.push(userId);
        story.likesCount = story.likes.length;
    }

    await story.save();

    return res.status(200).json(
        new ApiResponse(200, {
            liked: likeIndex === -1,
            likesCount: story.likesCount
        }, likeIndex > -1 ? "Story unliked" : "Story liked")
    );
});

// Add a comment to a story
export const addComment = asynchandler(async (req, res) => {
    const { storyId } = req.params;
    const { content } = req.body;

    const story = await TravelStory.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    const comment = await StoryComment.create({
        story: storyId,
        author: req.user._id,
        content
    });

    const populatedComment = await StoryComment.findById(comment._id)
        .populate('author', 'fullname UserName');

    return res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment added successfully")
    );
});

// Delete a comment
export const deleteComment = asynchandler(async (req, res) => {
    const { storyId, commentId } = req.params;

    const comment = await StoryComment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if comment belongs to this story
    if (comment.story.toString() !== storyId) {
        throw new ApiError(400, "Comment does not belong to this story");
    }

    // Only the comment author or admin can delete
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You can only delete your own comments");
    }

    await StoryComment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

// Toggle like on a comment
export const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await StoryComment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
        comment.likesCount = comment.likes.length;
    } else {
        comment.likes.push(userId);
        comment.likesCount = comment.likes.length;
    }

    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, {
            liked: likeIndex === -1,
            likesCount: comment.likesCount
        }, likeIndex > -1 ? "Comment unliked" : "Comment liked")
    );
});

// Remove an image from a story
export const removeImage = asynchandler(async (req, res) => {
    const { storyId } = req.params;
    const { imageUrl } = req.body;

    const story = await TravelStory.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    if (story.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only modify your own stories");
    }

    story.images = story.images.filter(img => img !== imageUrl);
    await story.save();

    return res.status(200).json(
        new ApiResponse(200, story, "Image removed successfully")
    );
});
