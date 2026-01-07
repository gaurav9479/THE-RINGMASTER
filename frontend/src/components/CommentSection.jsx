import { useState } from 'react';
import { Send, Heart, Trash2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/axios.auth';

const CommentSection = ({ storyId, comments = [], currentUserId, onCommentAdded, onCommentDeleted }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState(comments);
    const [likedComments, setLikedComments] = useState(new Set());

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await API.post(`/travel-stories/${storyId}/comments`, {
                content: newComment.trim()
            });

            const addedComment = response.data.data;
            setLocalComments(prev => [addedComment, ...prev]);
            setNewComment('');
            toast.success('Comment added!');

            if (onCommentAdded) {
                onCommentAdded(addedComment);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add comment';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await API.delete(`/travel-stories/${storyId}/comments/${commentId}`);
            setLocalComments(prev => prev.filter(c => c._id !== commentId));
            toast.success('Comment deleted');

            if (onCommentDeleted) {
                onCommentDeleted(commentId);
            }
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLike = async (commentId) => {
        try {
            const response = await API.post(`/travel-stories/${storyId}/comments/${commentId}/like`);
            const { liked, likesCount } = response.data.data;

            setLocalComments(prev => prev.map(c =>
                c._id === commentId ? { ...c, likesCount } : c
            ));

            if (liked) {
                setLikedComments(prev => new Set([...prev, commentId]));
            } else {
                setLikedComments(prev => {
                    const next = new Set(prev);
                    next.delete(commentId);
                    return next;
                });
            }
        } catch (error) {
            toast.error('Please login to like comments');
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">
                Comments ({localComments.length})
            </h3>

            {/* Comment Form */}
            {currentUserId && (
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-white" />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            maxLength={1000}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute right-3 bottom-3 text-cyan-500 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                </form>
            )}

            {!currentUserId && (
                <p className="text-gray-500 text-sm text-center py-4">
                    Please login to leave a comment
                </p>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {localComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    localComments.map((comment) => (
                        <div
                            key={comment._id}
                            className="bg-gray-900/30 border border-white/5 rounded-xl p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User size={14} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white text-sm">
                                                {comment.author?.fullname || comment.author?.UserName || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        {currentUserId === comment.author?._id && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1 break-words">
                                        {comment.content}
                                    </p>
                                    <button
                                        onClick={() => handleLike(comment._id)}
                                        className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                                            likedComments.has(comment._id)
                                                ? 'text-red-500'
                                                : 'text-gray-500 hover:text-red-400'
                                        }`}
                                    >
                                        <Heart
                                            size={12}
                                            className={likedComments.has(comment._id) ? 'fill-current' : ''}
                                        />
                                        {comment.likesCount || 0}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
