import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images = [], className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!images || images.length === 0) return null;

    const goToPrevious = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    // Single image layout
    if (images.length === 1) {
        return (
            <>
                <div
                    className={`relative cursor-pointer group ${className}`}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={images[0]}
                        alt="Travel story"
                        className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                </div>
                {isLightboxOpen && (
                    <Lightbox
                        images={images}
                        currentIndex={currentIndex}
                        onClose={closeLightbox}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                    />
                )}
            </>
        );
    }

    // Grid layout for multiple images
    return (
        <>
            <div className={`grid gap-2 ${className}`}>
                {images.length === 2 && (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative cursor-pointer group"
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`Travel story ${idx + 1}`}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {images.length === 3 && (
                    <div className="grid grid-cols-2 gap-2">
                        <div
                            className="relative cursor-pointer group row-span-2"
                            onClick={() => openLightbox(0)}
                        >
                            <img
                                src={images[0]}
                                alt="Travel story 1"
                                className="w-full h-full object-cover rounded-xl"
                                style={{ minHeight: '256px' }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
                        </div>
                        {images.slice(1).map((img, idx) => (
                            <div
                                key={idx + 1}
                                className="relative cursor-pointer group"
                                onClick={() => openLightbox(idx + 1)}
                            >
                                <img
                                    src={img}
                                    alt={`Travel story ${idx + 2}`}
                                    className="w-full h-32 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {images.length >= 4 && (
                    <div className="grid grid-cols-4 gap-2">
                        <div
                            className="col-span-2 row-span-2 relative cursor-pointer group"
                            onClick={() => openLightbox(0)}
                        >
                            <img
                                src={images[0]}
                                alt="Travel story 1"
                                className="w-full h-64 object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
                        </div>
                        {images.slice(1, 4).map((img, idx) => (
                            <div
                                key={idx + 1}
                                className="relative cursor-pointer group"
                                onClick={() => openLightbox(idx + 1)}
                            >
                                <img
                                    src={img}
                                    alt={`Travel story ${idx + 2}`}
                                    className="w-full h-32 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
                                {idx === 2 && images.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            +{images.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isLightboxOpen && (
                <Lightbox
                    images={images}
                    currentIndex={currentIndex}
                    onClose={closeLightbox}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                />
            )}
        </>
    );
};

const Lightbox = ({ images, currentIndex, onClose, onPrevious, onNext }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            >
                <X size={32} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-white/70 text-sm">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            {images.length > 1 && (
                <button
                    onClick={onPrevious}
                    className="absolute left-4 text-white/70 hover:text-white transition-colors p-2 bg-black/30 rounded-full"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            {/* Image */}
            <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 text-white/70 hover:text-white transition-colors p-2 bg-black/30 rounded-full"
                >
                    <ChevronRight size={32} />
                </button>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrevious && onNext && (() => {
                                    // Navigate to specific image
                                    while (idx !== currentIndex) {
                                        if (idx > currentIndex) onNext(e);
                                        else onPrevious(e);
                                    }
                                })();
                            }}
                            className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                                idx === currentIndex ? 'border-cyan-500' : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
