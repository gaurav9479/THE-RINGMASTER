import { MapPin,Hotel as HotelIcon,
    UtensilsCrossed,
    Calendar,
    ArrowLeft,
    Loader2,
    Cloud,
    Thermometer} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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

    return(
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <button 
                onClick={()=>navigate('/search')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition">
                    <ArrowLeft size={20}/>
                    ${city} sahi nahi hai kahi aur Chale ??
                </button>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-secondary" size={32} />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-500">{destination}</h1>
                            <p className="text-gray-600">
                                {tabs[0].count} results found
                            </p>
                        </div>
                    </div>
                    {weather && (
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg">
                            <Cloud className="text-blue-600" size={32}/>
                            <div className="flex items-center gap-2">
                                <Thermometer size={18} className="text-blue-600"/>
                                <span className="text-2xl font-bold text-gray-800">
                                        {Math.round(weather.main.temp)}°C
                                </span>

                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                                {weather.weather[0].description}
                            </p>
                        </div>
                    )}
                    

                </div>

            </div>
        </div>
    )

}