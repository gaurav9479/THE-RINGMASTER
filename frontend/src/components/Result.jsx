import { MapPin,Hotel as HotelIcon,
    UtensilsCrossed,
    Calendar,
    ArrowLeft,
    Loader2,
    Cloud,
    Thermometer} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDestination } from "../Context/PlaceContext.jsx";

function Results(){
    const {city}=useParams();
    const navigate=useNavigate();
    const { 
        destination,
        searchResult, 
        loading, 
        searchDestination,
        getFilteredData,
        getWeather
    } = useDestination();
    const [activeTab, setActiveTab] = useState('all');
    useEffect(() => {
        if (city !== destination) {
            searchDestination(city);
        }
    }, [city]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-secondary mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Searching {city}...</p>
                </div>
            </div>
        );
    }

    if (!searchResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No results found</h2>
                    <button
                        onClick={() => navigate('/search')}
                        className="text-secondary hover:underline"
                    >
                        Go back to search
                    </button>
                </div>
            </div>
        );
    }

    const weather = getWeather();
    const tabs = [
        { 
            id: 'all', 
            label: 'All', 
            count: searchResult.results.hotels + 
                    searchResult.results.restaurants + 
                    searchResult.results.events
        },
        { id: 'hotels', label: 'Hotels', count: searchResult.results.hotels, icon: HotelIcon },
        { id: 'restaurants', label: 'Restaurants', count: searchResult.results.restaurants, icon: UtensilsCrossed },
        { id: 'events', label: 'Events', count: searchResult.results.events, icon: Calendar }
    ];
    const filteredData=getFilteredData(activeTab)

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/search')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition"
                    >
                        <ArrowLeft size={20} />
                        Back to Search
                    </button>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-secondary" size={32} />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{destination}</h1>
                                <p className="text-gray-600">
                                    {tabs[0].count} results found
                                </p>
                            </div>
                        </div>


                        {weather && (
                            <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg">
                                <Cloud className="text-blue-600" size={32} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Thermometer size={18} className="text-blue-600" />
                                        <span className="text-2xl font-bold text-gray-800">
                                            {Math.round(weather.main.temp)}°C
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 capitalize">
                                        {weather.weather[0].description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                                        activeTab === tab.id
                                            ? 'bg-secondary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {Icon && <Icon size={18} />}
                                    {tab.label}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        activeTab === tab.id ? 'bg-white/20' : 'bg-gray-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 py-8">
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((item, index) => (
                            <ResultCard key={index} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            No {activeTab === 'all' ? 'results' : activeTab} found in {destination}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
function ResultCard({ item }) {
    const getIcon = () => {
        switch (item.type) {
            case 'hotel': return <HotelIcon className="text-blue-600" size={20} />;
            case 'restaurant': return <UtensilsCrossed className="text-orange-600" size={20} />;
            case 'event': return <Calendar className="text-purple-600" size={20} />;
            default: return null;
        }
    };

    const getTypeColor = () => {
        switch (item.type) {
            case 'hotel': return 'bg-blue-100 text-blue-800';
            case 'restaurant': return 'bg-orange-100 text-orange-800';
            case 'event': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <img
                src={item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                alt={item.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
                            {item.type}
                        </span>
                    </div>
                    {item.rating && (
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold">{item.rating}</span>
                        </div>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                
                {item.address && (
                    <p className="text-gray-600 text-sm flex items-start gap-1 mb-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        {item.address}
                    </p>
                )}
                
                {item.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.description}
                    </p>
                )}

                {/* Event specific fields */}
                {item.type === 'event' && item.date && (
                    <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                        <Calendar size={16} />
                        {new Date(item.date).toLocaleDateString()}
                    </p>
                )}
                
                {item.price && (
                    <p className="text-secondary font-semibold text-lg">
                        ₹{item.price}
                        {item.type === 'hotel' && ' / night'}
                        {item.type === 'event' && ' / ticket'}
                    </p>
                )}
                
                <button className="mt-4 w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Results;