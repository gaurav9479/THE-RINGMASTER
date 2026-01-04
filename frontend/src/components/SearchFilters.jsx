import { useState } from 'react';
import { Filter, X, ChevronDown, Star } from 'lucide-react';

/**
 * SearchFilters component for filtering search results
 */
const SearchFilters = ({ filters, onFiltersChange, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);

    const priceRanges = [
        { label: 'Any Price', min: null, max: null },
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 - $500', min: 200, max: 500 },
        { label: 'Over $500', min: 500, max: null },
    ];

    const amenitiesList = [
        'WiFi', 'Pool', 'Parking', 'Restaurant', 'Gym',
        'Spa', 'Room Service', 'Bar', 'Pet Friendly', 'AC'
    ];

    const sortOptions = [
        { value: 'rating', label: 'Top Rated' },
        { value: 'price_per_night', label: 'Price' },
        { value: 'name', label: 'Name' },
    ];

    const handlePriceChange = (range) => {
        onFiltersChange({
            ...filters,
            minPrice: range.min,
            maxPrice: range.max
        });
    };

    const handleRatingChange = (rating) => {
        onFiltersChange({
            ...filters,
            minRating: filters.minRating === rating ? null : rating
        });
    };

    const handleAmenityToggle = (amenity) => {
        const currentAmenities = filters.amenities ? filters.amenities.split(',') : [];
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];

        onFiltersChange({
            ...filters,
            amenities: newAmenities.length > 0 ? newAmenities.join(',') : null
        });
    };

    const handleSortChange = (sortBy) => {
        onFiltersChange({
            ...filters,
            sortBy,
            sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc'
        });
    };

    const activeFiltersCount = [
        filters.minPrice || filters.maxPrice,
        filters.minRating,
        filters.amenities
    ].filter(Boolean).length;

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-white hover:bg-gray-800 transition-colors"
            >
                <Filter size={18} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                    <span className="bg-cyan-500 text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFiltersCount}
                    </span>
                )}
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Filters Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">Filters</h3>
                        <button
                            onClick={() => {
                                onReset();
                                setIsOpen(false);
                            }}
                            className="text-sm text-cyan-400 hover:text-cyan-300"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Price Range</h4>
                        <div className="flex flex-wrap gap-2">
                            {priceRanges.map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => handlePriceChange(range)}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                        filters.minPrice === range.min && filters.maxPrice === range.max
                                            ? 'bg-cyan-500 border-cyan-500 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Minimum Rating */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Minimum Rating</h4>
                        <div className="flex gap-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                        filters.minRating === rating
                                            ? 'bg-yellow-500 border-yellow-500 text-black'
                                            : 'border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    <Star size={12} className="fill-current" />
                                    {rating}+
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                            {amenitiesList.map((amenity) => {
                                const isSelected = filters.amenities?.includes(amenity);
                                return (
                                    <button
                                        key={amenity}
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                            isSelected
                                                ? 'bg-purple-500 border-purple-500 text-white'
                                                : 'border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        {amenity}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Sort By</h4>
                        <div className="flex gap-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                        filters.sortBy === option.value
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    {option.label}
                                    {filters.sortBy === option.value && (
                                        <span>{filters.sortOrder === 'desc' ? '↓' : '↑'}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
