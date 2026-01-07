import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, ArrowLeft, Edit, Trash2, Share2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import ImageGallery from './ImageGallery';
import StarRating from './StarRating';
import CommentSection from './CommentSection';
import API from '../utils/axios.auth';
import { AuthContext } from '../Context/AuthContext';

const TravelStoryDetail = () => {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(AuthContext);
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        fetchStory();
    }, [storyId]);

    const fetchStory = async () => {
        try {
            const response = await API.get(`/travel-stories/${storyId}`);
            const { story: storyData, comments: commentsData } = response.data.data;
            setStory(storyData);
            setComments(commentsData || []);
            setLikesCount(storyData.likesCount || 0);
            setIsLiked(user && storyData.likes?.includes(user._id));
        } catch (error) {
            toast.error('Failed to load story');
            navigate('/travel-stories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isLoggedIn) {
            toast.error('Please login to like stories');
            return;
        }

        try {
            const response = await API.post(`/travel-stories/${storyId}/like`);
            const { liked, likesCount: newCount } = response.data.data;
            setIsLiked(liked);
            setLikesCount(newCount);
        } catch (error) {
            toast.error('Failed to like story');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            return;
        }

        try {
            await API.delete(`/travel-stories/${storyId}`);
            toast.success('Story deleted successfully');
            navigate('/my-stories');
        } catch (error) {
            toast.error('Failed to delete story');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: story.title,
                    text: `Check out this travel story: ${story.title}`,
                    url
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            // User cancelled share
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getLocationString = () => {
        const parts = [];
        if (story?.location?.name) parts.push(story.location.name);
        if (story?.location?.city) parts.push(story.location.city);
        if (story?.location?.country) parts.push(story.location.country);
        return parts.join(', ') || 'Unknown location';
    };

    const isAuthor = user && story && story.author?._id === user._id;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center">
                <p className="text-gray-500">Story not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    to="/travel-stories"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Stories
                </Link>

                {/* Main Content */}
                <article className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
                    {/* Image Gallery */}
                    {story.images && story.images.length > 0 && (
                        <div className="p-4">
                            <ImageGallery images={story.images} />
                        </div>
                    )}

                    <div className="p-6 md:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    {story.title}
                                </h1>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                    {/* Author */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <span className="font-medium text-white">
                                            {story.author?.fullname || story.author?.UserName || 'Anonymous'}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <span>{formatDate(story.createdAt)}</span>

                                    {/* Location */}
                                    <div className="flex items-center gap-1 text-cyan-400">
                                        <MapPin size={14} />
                                        {getLocationString()}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {isAuthor && (
                                    <>
                                        <Link
                                            to={`/edit-story/${story._id}`}
                                            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                                        >
                                            <Edit size={20} />
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Rating & Visit Date */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/5">
                            {story.rating && (
                                <div className="flex items-center gap-2">
                                    <StarRating rating={story.rating} readOnly size="md" />
                                    <span className="text-gray-400 text-sm">
                                        ({story.rating}/5)
                                    </span>
                                </div>
                            )}
                            {story.visitDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} className="text-cyan-500" />
                                    Visited on {formatDate(story.visitDate)}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {story.content}
                            </div>
                        </div>

                        {/* Tags */}
                        {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4">
                                {story.tags.map((tag, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/travel-stories?tag=${tag}`}
                                        className="text-sm bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/20 transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Like Button */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                    isLiked
                                        ? 'bg-red-500/20 text-red-500'
                                        : 'bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                            >
                                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                                <span className="font-medium">{likesCount}</span>
                            </button>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="mt-8 bg-gray-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
                    <CommentSection
                        storyId={storyId}
                        comments={comments}
                        currentUserId={user?._id}
                        onCommentAdded={(comment) => setComments(prev => [comment, ...prev])}
                        onCommentDeleted={(commentId) => setComments(prev => prev.filter(c => c._id !== commentId))}
                    />
                </div>
            </div>
        </div>
    );
};

export default TravelStoryDetail;
