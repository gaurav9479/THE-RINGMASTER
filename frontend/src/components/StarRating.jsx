import { Star } from 'lucide-react';

/**
 * StarRating component for displaying and selecting ratings
 * @param {Object} props
 * @param {number} props.rating - Current rating value (1-5)
 * @param {function} props.onRatingChange - Callback when rating changes (for interactive mode)
 * @param {boolean} props.readOnly - If true, stars are not clickable
 * @param {string} props.size - Size of stars ('sm', 'md', 'lg')
 * @param {boolean} props.showValue - Show numeric value next to stars
 */
const StarRating = ({
    rating = 0,
    onRatingChange,
    readOnly = false,
    size = 'md',
    showValue = false
}) => {
    const sizes = {
        sm: 14,
        md: 20,
        lg: 28
    };

    const starSize = sizes[size] || sizes.md;

    const handleClick = (value) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleClick(value)}
                    disabled={readOnly}
                    className={`
                        ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                        transition-transform focus:outline-none
                    `}
                >
                    <Star
                        size={starSize}
                        className={`
                            ${value <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-700 text-gray-600'
                            }
                            transition-colors
                        `}
                    />
                </button>
            ))}
            {showValue && (
                <span className="ml-2 text-sm font-semibold text-gray-400">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
