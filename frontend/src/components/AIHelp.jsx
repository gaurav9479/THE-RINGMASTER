import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMagic, FaMapMarkedAlt, FaCloudSun, FaMoneyBillWave, FaCalendarAlt, FaHotel, FaLandmark } from 'react-icons/fa';
import API from '../utils/axios.auth';

const AIHelp = () => {
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState('');
    const [loading, setLoading] = useState(false);
    const [tripPlan, setTripPlan] = useState(null);

    const handlePlanTrip = async (e) => {
        e.preventDefault();
        if (!destination || !days) {
            toast.error("Please provide both destination and duration.");
            return;
        }

        setLoading(true);
        try {
            const response = await API.post('/ai/plan', { destination, days: parseInt(days) });
            setTripPlan(response.data.data);
            toast.success("Trip plan generated successfully!");
        } catch (error) {
            console.error("Planning error:", error);
            toast.error(error.response?.data?.message || "Failed to generate trip plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-ringmaster-plum rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-ringmaster-crimson rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-ringmaster-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <h1 className="text-5xl font-bold mb-2 text-gold drop-shadow-lg font-serif animate-fade-in-up">
                Ringmaster's Roundtable
            </h1>
            <p className="text-xl mb-8 text-gray-300 italic animate-fade-in-up">
                "Where magic meets logistics. Let our agents plan your perfect spectacle."
            </p>

            <div className="w-full max-w-4xl glass-panel rounded-2xl p-8 mb-12 animate-fade-in-up">
                <form onSubmit={handlePlanTrip} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium mb-2 text-gold">Destination</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-3 rounded bg-black/30 border border-gray-600 focus:border-gold focus:outline-none text-white placeholder-gray-500 transition-colors"
                            placeholder="e.g., Mumbai, Delhi, Goa"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium mb-2 text-gold">Duration (Days)</label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full p-3 rounded bg-black/30 border border-gray-600 focus:border-gold focus:outline-none text-white placeholder-gray-500 transition-colors"
                            placeholder="e.g., 3"
                            min="1"
                            max="14"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto btn-primary px-8 py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <FaMagic className="animate-spin" /> Summoning Agents...
                            </>
                        ) : (
                            <>
                                <FaMagic /> Plan My Trip
                            </>
                        )}
                    </button>
                </form>
            </div>

            {tripPlan && (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Weather Card */}
                    <div className="glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-4 text-gold">
                            <FaCloudSun size={28} />
                            <h3 className="text-xl font-bold">Weather Forecast</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-bold text-gold">{tripPlan.weather.temp}</p>
                            <p className="text-lg capitalize text-gray-200">{tripPlan.weather.condition}</p>
                            <p className="text-sm text-gray-400">Humidity: {tripPlan.weather.humidity}</p>
                        </div>
                    </div>

                    {/* Route Card */}
                    <div className="glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-4 text-gold">
                            <FaMapMarkedAlt size={28} />
                            <h3 className="text-xl font-bold">The Journey</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-200"><span className="text-gray-400">Distance:</span> <span className="font-semibold text-gold">{tripPlan.route.distance}</span></p>
                            <p className="text-gray-200"><span className="text-gray-400">Est. Time:</span> <span className="font-semibold text-gold">{tripPlan.route.duration}</span></p>
                            <p className="text-sm text-gray-400 mt-2">{tripPlan.route.description}</p>
                        </div>
                    </div>

                    {/* Budget Card */}
                    <div className="glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-4 text-gold">
                            <FaMoneyBillWave size={28} />
                            <h3 className="text-xl font-bold">Budget Estimate</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-bold text-green-400">{tripPlan.budget.total}</p>
                            <div className="text-sm text-gray-300 mt-3 space-y-1">
                                <p className="flex justify-between"><span>Accommodation:</span> <span className="font-semibold">{tripPlan.budget.breakdown.accommodation}</span></p>
                                <p className="flex justify-between"><span>Food:</span> <span className="font-semibold">{tripPlan.budget.breakdown.food}</span></p>
                                <p className="flex justify-between"><span>Activities:</span> <span className="font-semibold">{tripPlan.budget.breakdown.activities}</span></p>
                                <p className="flex justify-between"><span>Travel:</span> <span className="font-semibold">{tripPlan.budget.breakdown.travel}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Itinerary - Full Width */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-6 text-gold">
                            <FaCalendarAlt size={28} />
                            <h3 className="text-2xl font-bold">The Grand Itinerary</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tripPlan.itinerary.map((day, index) => (
                                <div key={index} className="bg-black/40 p-5 rounded-lg border border-gray-700 hover:border-gold transition-colors">
                                    <h4 className="font-bold text-gold mb-3 text-lg">Day {day.day}</h4>
                                    <ul className="space-y-2">
                                        {day.activities.map((activity, actIndex) => (
                                            <li key={actIndex} className="flex items-start gap-2 text-sm">
                                                <span className="text-ringmaster-crimson mt-1 text-lg">•</span>
                                                <span className="text-gray-200">{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hotels */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-6 text-gold">
                            <FaHotel size={28} />
                            <h3 className="text-2xl font-bold">Recommended Hotels</h3>
                        </div>
                        {tripPlan.hotels && tripPlan.hotels.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tripPlan.hotels.map((hotel, i) => (
                                    <div key={i} className="bg-black/40 p-5 rounded-lg border border-gray-700 hover:border-gold transition-colors">
                                        <h4 className="font-bold text-gold text-lg mb-2">{hotel.name}</h4>
                                        <p className="text-sm text-gray-400 mb-2">{hotel.address}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-green-400 font-bold text-lg">${hotel.price_per_night}/night</span>
                                            <span className="text-gold">{'⭐'.repeat(hotel.rating || 4)}</span>
                                        </div>
                                        {hotel.amenities && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="text-xs bg-ringmaster-plum px-2 py-1 rounded text-gray-300">{amenity}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hotels found for this destination.</p>
                        )}
                    </div>

                    {/* Events */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel p-6 rounded-xl card-hover">
                        <div className="flex items-center gap-3 mb-6 text-gold">
                            <FaLandmark size={28} />
                            <h3 className="text-2xl font-bold">Local Attractions</h3>
                        </div>
                        {tripPlan.events && tripPlan.events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tripPlan.events.map((event, i) => (
                                    <div key={i} className="bg-black/40 p-5 rounded-lg border border-gray-700 hover:border-gold transition-colors">
                                        <h4 className="font-bold text-gold text-lg mb-2">{event.place}</h4>
                                        <p className="text-sm text-ringmaster-crimson font-semibold mb-2">{event.type}</p>
                                        <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                                        <div className="mt-3 space-y-1 text-xs text-gray-400">
                                            <p><span className="text-gold">Duration:</span> {event.duration}</p>
                                            <p><span className="text-gold">Best Time:</span> {event.bestTimeToVisit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No events found for this destination.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIHelp;
