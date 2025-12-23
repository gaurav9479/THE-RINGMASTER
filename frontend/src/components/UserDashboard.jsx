import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Map } from 'lucide-react';

function UserDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center">
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                How would you like to plan?
            </h1>
            <p className="text-gray-400 mb-12 text-center max-w-xl">
                Choose the best way to organize your trip. Use our advanced AI or explore manually.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                
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

            </div>
        </div>
    );
}

export default UserDashboard;
