import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, MapPin, Calendar, Wallet, Loader2, Plane, Hotel, Utensils, Zap } from 'lucide-react';

const AiPlanner = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [prefs, setPrefs] = useState({
    destination: '',
    duration: 3,
    budget: 50000,
    vibe: 'adventure'
  });

  const vibes = [
    { id: 'adventure', label: 'Adventure', icon: <Compass className="w-6 h-6" /> },
    { id: 'relaxing', label: 'Relaxing', icon: <Hotel className="w-6 h-6" /> },
    { id: 'culture', label: 'Culture', icon: <MapPin className="w-6 h-6" /> },
    { id: 'party', label: 'Party', icon: <Sparkles className="w-6 h-6" /> }
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const generateItinerary = () => {
    setLoading(true);
    // Simulate AI thinking
    setTimeout(() => {
      setLoading(false);
      setItinerary([
        {
          day: 1,
          title: "The Arrival & Exploration",
          activities: [
            { time: "09:00 AM", task: "Check-in at Premium Boutique Hotel", icon: <Hotel /> },
            { time: "12:30 PM", task: "Authentic Local Cuisine Lunch", icon: <Utensils /> },
            { time: "03:00 PM", task: "Explore the City Heritage Sites", icon: <MapPin /> }
          ]
        },
        {
          day: 2,
          title: "Deep Dive into " + prefs.vibe,
          activities: [
            { time: "08:00 AM", task: "Guided " + prefs.vibe + " Tour", icon: <Compass /> },
            { time: "01:00 PM", task: "Hidden Gem Discovery", icon: <MapPin /> },
            { time: "07:00 PM", task: "Evening Gala & Networking", icon: <Sparkles /> }
          ]
        },
        {
          day: 3,
          title: "Farwell & Memories",
          activities: [
            { time: "10:00 AM", task: "Souvenir Shopping at Local Markets", icon: <Zap /> },
            { time: "02:00 PM", task: "Signature Farwell Meal", icon: <Utensils /> },
            { time: "05:00 PM", task: "Departure Transfer", icon: <Plane /> }
          ]
        }
      ]);
      setStep(5);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pt-24 md:p-24 flex flex-col items-center">
      <AnimatePresence mode='wait'>
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Where are we headed?</h2>
            <div className="flex flex-col space-y-4">
              <label className="text-gray-400 flex items-center gap-2"> <MapPin className="w-4 h-4"/> Destination</label>
              <input 
                type="text" 
                value={prefs.destination}
                onChange={(e) => setPrefs({...prefs, destination: e.target.value})}
                placeholder="Paris, Tokyo, Mars..."
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button 
                onClick={handleNext}
                disabled={!prefs.destination}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <h2 className="text-4xl font-bold text-center">What's the vibe?</h2>
            <div className="grid grid-cols-2 gap-4">
              {vibes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setPrefs({...prefs, vibe: v.id})}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${prefs.vibe === v.id ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                >
                  {v.icon}
                  <span className="font-semibold">{v.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 text-gray-400 py-4">Back</button>
              <button onClick={handleNext} className="flex-2 bg-purple-600 font-bold py-4 rounded-xl flex-grow">Next</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <h2 className="text-4xl font-bold text-center">Setup Budget & Days</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-gray-400 flex items-center justify-between">
                  <span><Wallet className="w-4 h-4 inline mr-2"/> Budget</span>
                  <span className="text-white font-bold">₹{prefs.budget.toLocaleString()}</span>
                </label>
                <input 
                  type="range" min="10000" max="500000" step="5000"
                  value={prefs.budget}
                  onChange={(e) => setPrefs({...prefs, budget: parseInt(e.target.value)})}
                  className="w-full accent-purple-500"
                />
              </div>
              <div className="space-y-4">
                <label className="text-gray-400 flex items-center justify-between">
                  <span><Calendar className="w-4 h-4 inline mr-2"/> Duration</span>
                  <span className="text-white font-bold">{prefs.duration} Days</span>
                </label>
                <input 
                  type="range" min="1" max="14"
                  value={prefs.duration}
                  onChange={(e) => setPrefs({...prefs, duration: parseInt(e.target.value)})}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
            <button 
              onClick={handleNext}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl"
            >
              Generate Magic Itinerary
            </button>
          </motion.div>
        )}

        {step === 4 || loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-t-4 border-purple-500"
              />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Architecting your getaway...</h3>
              <p className="text-gray-400">Our AI travel agents are scouting the best spots in {prefs.destination}</p>
            </div>
            {!loading && <button onClick={generateItinerary} className="mt-4 bg-purple-600 px-8 py-3 rounded-full font-bold">Launch AI Core</button>}
          </motion.div>
        ) : null}

        {step === 5 && itinerary && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl space-y-12 pb-24"
          >
            <div className="text-center">
              <div className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-2">Magic Generated Itinerary</div>
              <h2 className="text-5xl font-bold">{prefs.destination} Extravaganza</h2>
              <p className="text-gray-400 mt-2">{prefs.duration} Days of {prefs.vibe} • Budget: ₹{prefs.budget.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {itinerary.map((day) => (
                <div key={day.day} className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 font-black text-6xl text-white/5 group-hover:text-purple-500/10 transition-colors">0{day.day}</div>
                  <h3 className="text-xl font-bold mb-6 text-purple-400 relative z-10">Day {day.day}</h3>
                  <div className="space-y-8 relative z-10">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-gray-800 rounded-lg text-white">
                            {React.cloneElement(act.icon, { size: 18 })}
                          </div>
                          {i !== day.activities.length - 1 && <div className="w-0.5 flex-grow bg-gray-800 my-2" />}
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-tighter">{act.time}</div>
                          <div className="text-sm text-gray-200 leading-tight">{act.task}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all font-bold"
              >
                Plan Another
              </button>
              <button 
                onClick={() => alert('Saved to My Trip!')}
                className="px-8 py-4 bg-purple-600 rounded-2xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-500/20"
              >
                Save Itinerary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiPlanner;
