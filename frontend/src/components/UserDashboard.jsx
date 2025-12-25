import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Map, Navigation, Compass } from 'lucide-react';
import FortuneTeller from './FortuneTeller';

function UserDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center pt-24">
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                How would you like to plan?
            </h1>
            <p className="text-gray-400 mb-12 text-center max-w-xl">
                Choose the best way to organize your trip. Use our advanced AI or explore manually.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                
                {/* AI Mode Card */}
                <div 
                    onClick={() => navigate('/ai-planner')} 
                    className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Bot size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">AI Planner</h2>
                    <p className="text-gray-400">
                        Let our intelligent assistant craft the perfect itinerary for you based on your preferences.
                    </p>
                </div>

                {/* Manual Mode Card */}
                <div 
                    onClick={() => navigate('/manual-explorer')}
                    className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/10"
                >
                    <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <Map size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Manual Explorer</h2>
                    <p className="text-gray-400">
                        Browse top-rated hotels and restaurants, add them to your cart, and build your own trip.
                    </p>
                </div>

                {/* Smart Route Card */}
                <div 
                    onClick={() => navigate('/smart-route')}
                    className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <Navigation className="animate-pulse" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Smart Route</h2>
                    <p className="text-gray-400">
                        Experience precision routing combined with live weather forecasts for your entire journey.
                    </p>
                </div>

            </div>

            {/* Travel Fortune Teller Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-24 pt-12 border-t border-white/5 w-full max-w-4xl"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem]">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-black italic">The Traveler's Oracle</h2>
                        <p className="text-gray-400">Feeling undecided? Let the Ringmaster's crystal ball whisper your next adventure.</p>
                        <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                            </div>
                            <span className="text-xs font-bold text-gray-500">1.2k Seekers today</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <FortuneTeller />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default UserDashboard;
