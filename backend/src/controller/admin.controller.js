import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";
import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";

// ==================== DASHBOARD ANALYTICS ====================

// Get dashboard statistics
export const getDashboardStats = asynchandler(async (req, res) => {
    const [
        totalUsers,
        totalHotels,
        totalEvents,
        totalBookings,
        totalReviews,
        recentUsers,
        recentBookings,
        bookingsByStatus,
        usersByRole,
        bookingRevenue
    ] = await Promise.all([
        User.countDocuments(),
        Hotel.countDocuments(),
        Event.countDocuments(),
        Booking.countDocuments(),
        Review.countDocuments(),
        User.find()
            .select('fullname email role createdAt')
            .sort('-createdAt')
            .limit(5)
            .lean(),
        Booking.find()
            .populate('user', 'fullname email')
            .populate('item', 'name place')
            .sort('-createdAt')
            .limit(5)
            .lean(),
        Booking.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]),
        Booking.aggregate([
            { $match: { status: 'Confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
    ]);

    // Format booking status distribution
    const statusDistribution = { Pending: 0, Confirmed: 0, Cancelled: 0 };
    bookingsByStatus.forEach(s => {
        statusDistribution[s._id] = s.count;
    });

    // Format user role distribution
    const roleDistribution = { user: 0, admin: 0, hotel_owner: 0, event_organizer: 0 };
    usersByRole.forEach(r => {
        roleDistribution[r._id] = r.count;
    });

    return res.status(200).json(
        new ApiResponse(200, {
            overview: {
                totalUsers,
                totalHotels,
                totalEvents,
                totalBookings,
                totalReviews,
                totalRevenue: bookingRevenue[0]?.total || 0
            },
            distributions: {
                bookingStatus: statusDistribution,
                userRoles: roleDistribution
            },
            recent: {
                users: recentUsers,
                bookings: recentBookings
            }
        }, "Dashboard stats fetched successfully")
    );
});

// Get user growth analytics
export const getUserGrowthAnalytics = asynchandler(async (req, res) => {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const userGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const bookingGrowth = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            userGrowth,
            bookingGrowth,
            period: `Last ${days} days`
        }, "Growth analytics fetched successfully")
    );
});

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filters
export const getAllUsers = asynchandler(async (req, res) => {
    const { page = 1, limit = 20, role, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
        filter.$or = [
            { UserName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { fullname: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('-password -refreshtoken')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        User.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: getPaginationMeta(total, page, limit)
        }, "Users fetched successfully")
    );
});

// Get single user details
export const getUserById = asynchandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId)
        .select('-password -refreshtoken')
        .populate('trips')
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get user's bookings and reviews count
    const [bookingsCount, reviewsCount] = await Promise.all([
        Booking.countDocuments({ user: userId }),
        Review.countDocuments({ user: userId })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            ...user,
            stats: { bookingsCount, reviewsCount }
        }, "User details fetched successfully")
    );
});

// Update user role
export const updateUserRole = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'hotel_owner', 'event_organizer'].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    // Prevent changing own role
    if (userId === req.user._id.toString()) {
        throw new ApiError(400, "Cannot change your own role");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('-password -refreshtoken');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User role updated successfully")
    );
});

// Suspend/Unsuspend user
export const toggleUserSuspension = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const { suspended, reason } = req.body;

    // Prevent suspending self
    if (userId === req.user._id.toString()) {
        throw new ApiError(400, "Cannot suspend yourself");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            suspended: suspended,
            suspendedReason: suspended ? reason : null,
            suspendedAt: suspended ? new Date() : null
        },
        { new: true }
    ).select('-password -refreshtoken');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, `User ${suspended ? 'suspended' : 'unsuspended'} successfully`)
    );
});

// Delete user
export const deleteUser = asynchandler(async (req, res) => {
    const { userId } = req.params;

    // Prevent deleting self
    if (userId === req.user._id.toString()) {
        throw new ApiError(400, "Cannot delete yourself");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Delete user's data (bookings, reviews)
    await Promise.all([
        Booking.deleteMany({ user: userId }),
        Review.deleteMany({ user: userId }),
        User.findByIdAndDelete(userId)
    ]);

    return res.status(200).json(
        new ApiResponse(200, null, "User and associated data deleted successfully")
    );
});

// ==================== CONTENT MODERATION ====================

// Get all reviews for moderation
export const getReviewsForModeration = asynchandler(async (req, res) => {
    const { page = 1, limit = 20, status = 'all' } = req.query;

    const filter = {};
    if (status === 'reported') {
        filter.reported = true;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate('user', 'fullname email UserName')
            .populate('item', 'name place')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Review.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: getPaginationMeta(total, page, limit)
        }, "Reviews fetched successfully")
    );
});

// Delete review (admin)
export const adminDeleteReview = asynchandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

// Get all hotels for moderation
export const getHotelsForModeration = asynchandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [hotels, total] = await Promise.all([
        Hotel.find()
            .populate('owner', 'fullname email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Hotel.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            hotels,
            pagination: getPaginationMeta(total, page, limit)
        }, "Hotels fetched successfully")
    );
});

// Delete hotel (admin)
export const adminDeleteHotel = asynchandler(async (req, res) => {
    const { hotelId } = req.params;

    const hotel = await Hotel.findByIdAndDelete(hotelId);

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // Delete associated bookings and reviews
    await Promise.all([
        Booking.deleteMany({ item: hotelId, itemType: 'Hotel' }),
        Review.deleteMany({ item: hotelId, itemType: 'Hotel' })
    ]);

    return res.status(200).json(
        new ApiResponse(200, null, "Hotel and associated data deleted successfully")
    );
});

// Get all events for moderation
export const getEventsForModeration = asynchandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        Event.find()
            .populate('organizer', 'fullname email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Event.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            events,
            pagination: getPaginationMeta(total, page, limit)
        }, "Events fetched successfully")
    );
});

// Delete event (admin)
export const adminDeleteEvent = asynchandler(async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Delete associated bookings and reviews
    await Promise.all([
        Booking.deleteMany({ item: eventId, itemType: 'Events' }),
        Review.deleteMany({ item: eventId, itemType: 'Events' })
    ]);

    return res.status(200).json(
        new ApiResponse(200, null, "Event and associated data deleted successfully")
    );
});
