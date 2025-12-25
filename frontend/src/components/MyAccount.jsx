import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, MapPin, Award, Star, Settings, ChevronRight, Loader2, Calendar } from 'lucide-react';
import API from '../utils/axios.auth';

function MyAccount() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const user = {
    fullname: storedUser.username || "Gaurav Prajapati",
    username: `@${storedUser.username || 'gaurav9479'}`,
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    stamps: [
      { id: 1, city: "Mumbai", date: "Oct 2024", color: "bg-blue-500", icon: "🇮🇳" },
      { id: 2, city: "Paris", date: "Nov 2024", color: "bg-purple-500", icon: "🇫🇷" },
      { id: 3, city: "Tokyo", date: "Dec 2024", color: "bg-red-500", icon: "🇯🇵" },
      { id: 4, city: "Goa", date: "Jan 2025", color: "bg-yellow-500", icon: "🌴" },
    ]
  };

  const ACHIEVEMENTS = [
    { title: "First Explorer", desc: "Booked your first trip", icon: <MapPin className="text-blue-400" /> },
    { title: "Review Master", desc: "Left 10 reviews", icon: <Star className="text-yellow-400" /> },
    { title: "Eco-Traveler", desc: "Chose 5 green hotels", icon: <Award className="text-green-400" /> }
  ];

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const response = await API.get("/bookings/user");
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-1 mb-6">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <User size={64} className="text-white/20" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">{user.fullname}</h2>
            <p className="text-gray-500">{user.username}</p>
            
            <div className="mt-8 w-full space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-400 font-bold">Level {user.level}</span>
                <span className="text-gray-500">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </div>

            <button className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-2 font-semibold">
              <Settings size={18} /> Edit Profile
            </button>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6">Badges</h3>
            <div className="space-y-4">
              {ACHIEVEMENTS.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl">
                  <div className="p-2 bg-gray-800 rounded-xl">{ach.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{ach.title}</div>
                    <div className="text-xs text-gray-500">{ach.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Passport Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Travel Passport</h3>
              <span className="bg-purple-600/20 text-purple-400 px-4 py-1 rounded-full text-sm font-bold border border-purple-500/20">
                {user.stamps.length} Destinations
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {user.stamps.map((stamp) => (
                <motion.div 
                  key={stamp.id}
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  className="bg-gray-900 border border-white/5 rounded-3xl p-6 aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-xl"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${stamp.color}`} />
                  <div className="text-4xl mb-3 drop-shadow-lg">{stamp.icon}</div>
                  <div className="font-bold">{stamp.city}</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest">{stamp.date}</div>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
              
              <div className="bg-gray-900/40 border-2 border-dashed border-white/5 rounded-3xl p-6 aspect-square flex flex-col items-center justify-center text-center text-gray-700">
                <div className="text-3xl mb-2 opacity-20">?</div>
                <div className="text-xs font-bold">Next Trip?</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6 italic">🎩 Upcoming Reservations</h3>
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6">
               {loading ? (
                 <div className="flex justify-center p-8">
                   <Loader2 className="animate-spin text-purple-500" />
                 </div>
               ) : bookings.length > 0 ? (
                 bookings.map((booking) => (
                   <div key={booking._id} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                      <div className="flex items-center gap-5">
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg ring-1 ring-white/20">
                           {booking.itemType === 'Hotel' ? <MapPin size={24} /> : <Calendar size={24} />}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{booking.item?.name || booking.item?.place || "Trip Item"}</div>
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
                            {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-purple-400">₹{booking.totalPrice?.toLocaleString()}</span>
                        <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 text-gray-600">
                   <p className="font-medium">No reservations found yet.</p>
                   <button className="text-purple-500 text-sm font-bold mt-2 hover:underline">Start Exploring</button>
                 </div>
               )}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

export default MyAccount;