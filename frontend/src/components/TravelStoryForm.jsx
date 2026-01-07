import { useState, useRef } from 'react';
import { Upload, X, MapPin, Calendar, Tag, Send, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import API from '../utils/axios.auth';

const TravelStoryForm = ({ story = null, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(story?.title || '');
    const [content, setContent] = useState(story?.content || '');
    const [locationName, setLocationName] = useState(story?.location?.name || '');
    const [city, setCity] = useState(story?.location?.city || '');
    const [country, setCountry] = useState(story?.location?.country || '');
    const [rating, setRating] = useState(story?.rating || 0);
    const [tags, setTags] = useState(story?.tags?.join(', ') || '');
    const [visitDate, setVisitDate] = useState(
        story?.visitDate ? new Date(story.visitDate).toISOString().split('T')[0] : ''
    );
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState(story?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length + images.length + files.length;

        if (totalImages > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is larger than 5MB`);
                return false;
            }
            return true;
        });

        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeNewImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const removeExistingImage = async (imageUrl) => {
        if (story) {
            try {
                await API.patch(`/travel-stories/${story._id}/remove-image`, { imageUrl });
                setExistingImages(prev => prev.filter(img => img !== imageUrl));
                toast.success('Image removed');
            } catch (error) {
                toast.error('Failed to remove image');
            }
        } else {
            setExistingImages(prev => prev.filter(img => img !== imageUrl));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!content.trim() || content.length < 20) {
            toast.error('Content must be at least 20 characters');
            return;
        }

        if (!locationName.trim()) {
            toast.error('Please enter a location name');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('content', content.trim());
            formData.append('location', JSON.stringify({
                name: locationName.trim(),
                city: city.trim(),
                country: country.trim()
            }));

            if (rating > 0) {
                formData.append('rating', rating);
            }

            if (tags.trim()) {
                const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
                formData.append('tags', JSON.stringify(tagArray));
            }

            if (visitDate) {
                formData.append('visitDate', visitDate);
            }

            images.forEach(img => {
                formData.append('images', img.file);
            });

            let response;
            if (story) {
                response = await API.patch(`/travel-stories/${story._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Story updated successfully!');
            } else {
                response = await API.post('/travel-stories', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Story published successfully!');
            }

            if (onSubmit) {
                onSubmit(response.data.data);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save story';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                    {story ? 'Edit Story' : 'Share Your Travel Story'}
                </h3>
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
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your story an engaging title"
                        maxLength={200}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <MapPin size={14} /> Location *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="Place name"
                            required
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City (optional)"
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country (optional)"
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">Your Story *</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your travel experience, tips, and memorable moments..."
                        rows={8}
                        maxLength={10000}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    />
                    <div className="text-xs text-gray-600 text-right">
                        {content.length}/10000
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <ImageIcon size={14} /> Photos (up to 10)
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {/* Existing images */}
                        {existingImages.map((img, idx) => (
                            <div key={`existing-${idx}`} className="relative group">
                                <img
                                    src={img}
                                    alt={`Existing ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(img)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* New images */}
                        {images.map((img, idx) => (
                            <div key={`new-${idx}`} className="relative group">
                                <img
                                    src={img.preview}
                                    alt={`New ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Upload button */}
                        {existingImages.length + images.length < 10 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                            >
                                <Upload size={20} />
                                <span className="text-xs mt-1">Upload</span>
                            </button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>

                {/* Rating & Visit Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400">
                            Rate this place (optional)
                        </label>
                        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                            <Calendar size={14} /> Visit Date (optional)
                        </label>
                        <input
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <Tag size={14} /> Tags (optional, comma-separated)
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., beach, adventure, food, culture"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || content.length < 20 || !locationName.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={18} />
                            {story ? 'Update Story' : 'Publish Story'}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TravelStoryForm;
