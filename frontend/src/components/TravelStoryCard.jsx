import { Heart, MessageCircle, MapPin, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const TravelStoryCard = ({ story, onLike, isLiked = false }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    const getLocationString = () => {
        const parts = [];
        if (story.location?.name) parts.push(story.location.name);
        if (story.location?.city) parts.push(story.location.city);
        if (story.location?.country) parts.push(story.location.country);
        return parts.join(', ') || 'Unknown location';
    };

    return (
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
            {/* Image */}
            <Link to={`/travel-stories/${story._id}`}>
                <div className="relative h-48 overflow-hidden">
                    {story.images && story.images.length > 0 ? (
                        <img
                            src={story.images[0]}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600/30 to-cyan-600/30 flex items-center justify-center">
                            <MapPin size={48} className="text-white/30" />
                        </div>
                    )}
                    {story.images && story.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            +{story.images.length - 1} photos
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Author & Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">
                            {story.author?.fullname || story.author?.UserName || 'Anonymous'}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {formatDate(story.createdAt)}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/travel-stories/${story._id}`}>
                    <h3 className="font-bold text-lg text-white hover:text-cyan-400 transition-colors line-clamp-2">
                        {story.title}
                    </h3>
                </Link>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={14} className="text-cyan-500" />
                    <span>{truncateText(getLocationString(), 40)}</span>
                </div>

                {/* Rating & Visit Date */}
                <div className="flex items-center justify-between">
                    {story.rating && (
                        <StarRating rating={story.rating} readOnly size="sm" />
                    )}
                    {story.visitDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            Visited {formatDate(story.visitDate)}
                        </div>
                    )}
                </div>

                {/* Content Preview */}
                <p className="text-gray-400 text-sm line-clamp-2">
                    {truncateText(story.content, 120)}
                </p>

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {story.tags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                        {story.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{story.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onLike && onLike(story._id);
                        }}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                        }`}
                    >
                        <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                        {story.likesCount || 0}
                    </button>
                    <Link
                        to={`/travel-stories/${story._id}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                        <MessageCircle size={16} />
                        {story.commentsCount || 0}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TravelStoryCard;
