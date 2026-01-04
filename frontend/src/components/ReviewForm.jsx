import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import API from '../utils/axios.auth';

/**
 * ReviewForm component for submitting new reviews
 */
const ReviewForm = ({ itemId, itemType, onReviewSubmitted, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await API.post('/reviews', {
                itemId,
                itemType,
                rating,
                title: title.trim(),
                comment: comment.trim()
            });

            toast.success('Review submitted successfully!');

            // Reset form
            setRating(0);
            setTitle('');
            setComment('');

            // Notify parent
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data.data);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit review';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Write a Review</h3>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">Your Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">
                        Review Title (Optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        maxLength={100}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with others..."
                        rows={4}
                        maxLength={1000}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    />
                    <div className="text-xs text-gray-600 text-right">
                        {comment.length}/1000
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || !comment.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Review
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
