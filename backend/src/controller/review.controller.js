import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";

// Create a new review
export const createReview = asynchandler(async (req, res) => {
    const { itemId, itemType, rating, title, comment } = req.body;

    // Validate item type
    if (!['Hotel', 'Restaurant', 'Events'].includes(itemType)) {
        throw new ApiError(400, "Invalid item type");
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
        user: req.user._id,
        item: itemId
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this item");
    }

    // Check if user has a booking for this item (for verified badge)
    const hasBooking = await Booking.findOne({
        user: req.user._id,
        item: itemId,
        status: 'Confirmed'
    });

    const review = await Review.create({
        user: req.user._id,
        item: itemId,
        itemType,
        rating,
        title,
        comment,
        verified: !!hasBooking
    });

    const populatedReview = await Review.findById(review._id)
        .populate('user', 'fullname UserName');

    return res.status(201).json(
        new ApiResponse(201, populatedReview, "Review created successfully")
    );
});

// Get reviews for an item
export const getItemReviews = asynchandler(async (req, res) => {
    const { itemId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [reviews, total] = await Promise.all([
        Review.find({ item: itemId })
            .populate('user', 'fullname UserName')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Review.countDocuments({ item: itemId })
    ]);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
        { $match: { item: itemId } },
        {
            $group: {
                _id: '$rating',
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: -1 } }
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDistribution.forEach(r => {
        distribution[r._id] = r.count;
    });

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            ratingDistribution: distribution,
            pagination: getPaginationMeta(total, page, limit)
        }, "Reviews fetched successfully")
    );
});

// Update a review
export const updateReview = asynchandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Only the review author can update
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own reviews");
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    await review.save();

    const updatedReview = await Review.findById(reviewId)
        .populate('user', 'fullname UserName');

    return res.status(200).json(
        new ApiResponse(200, updatedReview, "Review updated successfully")
    );
});

// Delete a review
export const deleteReview = asynchandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Only the review author or admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You can only delete your own reviews");
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

// Mark review as helpful
export const markHelpful = asynchandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { helpful: 1 } },
        { new: true }
    );

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res.status(200).json(
        new ApiResponse(200, review, "Marked as helpful")
    );
});

// Get user's reviews
export const getUserReviews = asynchandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find({ user: req.user._id })
            .populate('item')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Review.countDocuments({ user: req.user._id })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: getPaginationMeta(total, page, limit)
        }, "User reviews fetched successfully")
    );
});
