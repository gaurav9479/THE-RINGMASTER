import { ThumbsUp, CheckCircle, User } from 'lucide-react';
import StarRating from './StarRating';

/**
 * ReviewCard component for displaying individual reviews
 */
const ReviewCard = ({ review, onHelpful }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                                {review.user?.fullname || review.user?.UserName || 'Anonymous'}
                            </span>
                            {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                    <CheckCircle size={12} />
                                    Verified
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                </div>
                <StarRating rating={review.rating} readOnly size="sm" />
            </div>

            {/* Title */}
            {review.title && (
                <h4 className="font-bold text-white">{review.title}</h4>
            )}

            {/* Comment */}
            <p className="text-gray-400 text-sm leading-relaxed">
                {review.comment}
            </p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                    {review.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                    onClick={() => onHelpful && onHelpful(review._id)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                >
                    <ThumbsUp size={16} />
                    Helpful ({review.helpful || 0})
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;
