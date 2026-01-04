import React, { useState, useEffect } from 'react';
import API from '../utils/axios.auth';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Cloud, Thermometer, Wind, Droplets, Calendar, ArrowRight, Loader2, Map as MapIcon } from 'lucide-react';
import MagicPackingList from './MagicPackingList';

const SmartRoutePlanner = () => {
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);

    const getToday = () => new Date().toISOString().split('T')[0];
    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleQuickDate = (field, type) => {
        const date = type === 'today' ? getToday() : getTomorrow();
        setDates(prev => ({ ...prev, [field]: date }));
    };

    const handleSearch = async () => {
        if (!destination) return;
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Route (From Current Location Mock/Real to Destination)
            // Changed to GET request as route fetching is a read operation
            const routeRes = await API.get('/map/route', {
                params: {
                    origin: "Mumbai", // Mocking current location for now
                    destination: destination,
                    mode: "driving"
                }
            });

            // 2. Fetch Weather Forecast
            const weatherRes = await API.get('/weather/forecast', {
                params: {
                    destination: destination,
                    startDate: dates.start,
                    endDate: dates.end
                }
            });

            setRouteInfo(routeRes.data.data);
            setWeatherInfo(weatherRes.data.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch traveler details. Please check if coordinates and API keys are valid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 pt-24 md:p-12 lg:p-24">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header & Search */}
                <header className="space-y-6 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    >
                        Smart Route Planner
                    </motion.h1>
                    <p className="text-gray-400 text-lg">Plan your journey with real-time routing and weather insights.</p>
                </header>

                <div className="bg-gray-901/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                        
                        {/* Destination Input */}
                        <div className="lg:col-span-1 space-y-3">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                                <input 
                                    type="text" 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter city name..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Date Selectors */}
                        <div className="lg:col-span-1 space-y-3">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Travel Dates</label>
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleQuickDate('start', 'today')} className="flex-1 text-[10px] bg-white/5 hover:bg-white/10 py-1 rounded-md transition-colors">Today</button>
                                        <button onClick={() => handleQuickDate('start', 'tomorrow')} className="flex-1 text-[10px] bg-white/5 hover:bg-white/10 py-1 rounded-md transition-colors">Tomorrow</button>
                                    </div>
                                    <input type="date" value={dates.start} onChange={(e) => setDates({...dates, start: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none" />
                                </div>
                                <ArrowRight className="mt-8 text-gray-700" size={20} />
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleQuickDate('end', 'today')} className="flex-1 text-[10px] bg-white/5 hover:bg-white/10 py-1 rounded-md transition-colors">Today</button>
                                        <button onClick={() => handleQuickDate('end', 'tomorrow')} className="flex-1 text-[10px] bg-white/5 hover:bg-white/10 py-1 rounded-md transition-colors">Tomorrow</button>
                                    </div>
                                    <input type="date" value={dates.end} onChange={(e) => setDates({...dates, end: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Search Action */}
                        <button 
                            onClick={handleSearch}
                            disabled={loading || !destination}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Navigation size={20} />}
                            {loading ? 'Mapping Path...' : 'Plan My Route'}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-center">
                        {error}
                    </motion.div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                    {routeInfo && (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Route & Map Card */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400"><Navigation size={24} /></div>
                                            <div>
                                                <h3 className="font-bold text-xl">Trip Summary</h3>
                                                <p className="text-sm text-gray-500">{routeInfo.origin} to {routeInfo.destination}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-white">{routeInfo.distance}</div>
                                            <div className="text-xs text-cyan-500 font-bold uppercase tracking-tighter">Approx. {routeInfo.duration}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Map Mockup */}
                                    <div className="h-64 bg-gray-950 relative flex items-center justify-center group overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                                            {/* Stylized grid for map feel */}
                                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                                        </div>
                                        <MapIcon size={64} className="text-white/5 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-2/3 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                                <motion.div 
                                                    animate={{ left: ["0%", "100%"] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                                                />
                                                <div className="absolute -top-8 -left-2 text-xs font-bold bg-cyan-500 px-2 py-1 rounded">Start</div>
                                                <div className="absolute -top-8 -right-2 text-xs font-bold bg-gray-800 px-2 py-1 rounded">End</div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold">LIVE ROUTE AS OF {getToday()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Weather Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-900 border border-white/5 rounded-[2rem] p-8 h-full shadow-2xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><Cloud size={24} /></div>
                                        <h3 className="font-bold text-xl">Journey Forecast</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {weatherInfo?.forecast?.slice(0, 4).map((f, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-blue-400">
                                                        {f.weather.includes('rain') ? <Loader2 className="animate-spin" /> : <Cloud />}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-500">{new Date(f.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                        <div className="font-bold text-sm capitalize">{f.weather}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black">{Math.round(f.temperature)}°C</div>
                                                    <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500">
                                                        <Droplets size={10} /> {f.humidity}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {!weatherInfo?.forecast?.length && (
                                            <div className="text-center py-12 text-gray-600">No forecast data for selected period.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Magic Packing List Integration */}
                            <div className="lg:col-span-3">
                                <MagicPackingList vibe="Adventure" destination={destination} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SmartRoutePlanner;
