import { useState, useEffect } from 'react';
import { MessageSquare, Hotel, Calendar, Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../utils/axios.auth';

const ContentModeration = () => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        fetchContent();
    }, [activeTab, pagination.page]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'reviews'
                ? '/admin/moderation/reviews'
                : activeTab === 'hotels'
                ? '/admin/moderation/hotels'
                : '/admin/moderation/events';

            const response = await API.get(`${endpoint}?page=${pagination.page}&limit=10`);
            setContent(response.data.data[activeTab] || response.data.data.reviews || response.data.data.hotels || response.data.data.events || []);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.data.pagination.totalPages
            }));
        } catch (error) {
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this?')) return;

        try {
            const endpoint = activeTab === 'reviews'
                ? `/admin/moderation/reviews/${id}`
                : activeTab === 'hotels'
                ? `/admin/moderation/hotels/${id}`
                : `/admin/moderation/events/${id}`;

            await API.delete(endpoint);
            toast.success('Deleted successfully');
            fetchContent();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const tabs = [
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
        { id: 'hotels', label: 'Hotels', icon: Hotel },
        { id: 'events', label: 'Events', icon: Calendar },
    ];

    const renderReviewItem = (review) => (
        <div key={review._id} className="bg-black/20 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">{review.user?.fullname || 'Unknown'}</span>
                    <span className="text-gray-600">reviewed</span>
                    <span className="text-cyan-400">{review.item?.name || review.item?.place || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                        />
                    ))}
                </div>
                {review.title && <p className="text-white text-sm font-medium">{review.title}</p>}
                <p className="text-gray-400 text-sm mt-1">{review.comment}</p>
                <p className="text-gray-600 text-xs mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                </p>
            </div>
            <button
                onClick={() => handleDelete(review._id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    const renderHotelItem = (hotel) => (
        <div key={hotel._id} className="bg-black/20 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex gap-4">
                {hotel.image && (
                    <img src={hotel.image} alt={hotel.name} className="w-20 h-20 object-cover rounded-lg" />
                )}
                <div>
                    <p className="text-white font-medium">{hotel.name}</p>
                    <p className="text-gray-400 text-sm">{hotel.city}, {hotel.address}</p>
                    <p className="text-cyan-400 text-sm mt-1">${hotel.price_per_night}/night</p>
                    <p className="text-gray-500 text-xs mt-1">
                        Owner: {hotel.owner?.fullname || 'Unknown'} ({hotel.owner?.email})
                    </p>
                </div>
            </div>
            <button
                onClick={() => handleDelete(hotel._id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    const renderEventItem = (event) => (
        <div key={event._id} className="bg-black/20 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex gap-4">
                {event.image && (
                    <img src={event.image} alt={event.place} className="w-20 h-20 object-cover rounded-lg" />
                )}
                <div>
                    <p className="text-white font-medium">{event.place}</p>
                    <p className="text-gray-400 text-sm">{event.city}</p>
                    <p className="text-cyan-400 text-sm mt-1">{event.type} - {event.duration}</p>
                    <p className="text-gray-500 text-xs mt-1">
                        Organizer: {event.organizer?.fullname || 'Unknown'}
                    </p>
                </div>
            </div>
            <button
                onClick={() => handleDelete(event._id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : content.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No {activeTab} found
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'reviews' && content.map(renderReviewItem)}
                        {activeTab === 'hotels' && content.map(renderHotelItem)}
                        {activeTab === 'events' && content.map(renderEventItem)}
                    </div>
                )}

                {/* Pagination */}
                {content.length > 0 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                        <p className="text-gray-500 text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentModeration;
