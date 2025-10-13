import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDestination } from '../Context/PlaceContext.jsx';
import { Search as SearchIcon, MapPin, Clock } from 'lucide-react';

function Home() {
    const navigate = useNavigate();
    const { 
        destination, 
        setDestination, 
        searchDestination, 
        searchHistory, 
        clearHistory 
    } = useDestination();

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!destination.trim()) {
            return;
        }

        const result = await searchDestination(destination.trim());
        
        if (result.success) {
            navigate(`/results/${destination.trim()}`);
        }
    };

    const handleQuickSearch = async (city) => {
        setDestination(city);
        const result = await searchDestination(city);
        
        if (result.success) {
            navigate(`/results/${city}`);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Search */}
            <div 
                className="relative h-[600px] flex items-center justify-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Explore Your Next Adventure
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Discover hotels, restaurants, and events
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                        <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                            <SearchIcon className="absolute left-6 text-gray-400" size={24} />
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Search for a city or destination..."
                                className="w-full pl-16 pr-6 py-5 text-lg outline-none text-gray-800"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition font-semibold"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                            <Clock size={16} className="text-white/70" />
                            <span className="text-white/70 text-sm">Recent:</span>
                            {searchHistory.map((city, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickSearch(city)}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/30 transition"
                                >
                                    {city}
                                </button>
                            ))}
                            <button
                                onClick={clearHistory}
                                className="text-white/70 hover:text-white text-sm underline"
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Quick Search Suggestions */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <span className="text-white/70 text-sm w-full mb-2">Popular destinations:</span>
                        {['Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Bangalore', 'Kerala'].map((city) => (
                            <button
                                key={city}
                                onClick={() => handleQuickSearch(city)}
                                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Destinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5' },
                        { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7' },
                        { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2' }
                    ].map((dest) => (
                        <div
                            key={dest.name}
                            onClick={() => handleQuickSearch(dest.name)}
                            className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                                {dest.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;