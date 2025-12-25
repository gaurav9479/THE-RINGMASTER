import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, MapPin, X, Check, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API, { searchByCity } from '../utils/axios.auth';

// Local fallback data removed in favor of real backend fetching

function ManualExplorer() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('Mumbai');
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const fetchItems = async (city) => {
        setLoading(true);
        try {
            const response = await searchByCity(city);
            const data = response.data.data;
            const combined = [
                ...(data.hotels || []).map(h => ({ ...h, type: 'Hotel', id: h._id })),
                ...(data.resturant || []).map(r => ({ ...r, type: 'Restaurant', id: r._id })),
                ...(data.events || []).map(e => ({ ...e, type: 'Event', id: e._id }))
            ];
            setItems(combined);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(searchTerm);
    }, []);

    const addToCart = (item) => {
        if (!cart.find(i => i.id === item.id)) {
            setCart([...cart, item]);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleBuyNow = async () => {
        setLoading(true);
        try {
            // Process each item in the cart through the booking API
            const bookingPromises = cart.map(item => 
                API.post("/bookings/create", {
                    itemId: item.id,
                    itemType: item.type === 'Restaurant' ? 'Resturant' : item.type === 'Hotel' ? 'Hotel' : 'Events',
                    totalPrice: item.price || item.cost || 0
                })
            );

            await Promise.all(bookingPromises);

            setPurchaseSuccess(true);
            setTimeout(() => {
                setPurchaseSuccess(false);
                setCart([]);
                setIsCartOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ringmaster-gold via-white to-ringmaster-gold tracking-tighter uppercase italic">
                        🎩 The Grand Explorer
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Curate your perfect journey from our handpicked collections.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search by city..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchItems(searchTerm)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-ringmaster-gold transition-all"
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-4 bg-ringmaster-gold/10 hover:bg-ringmaster-gold/20 rounded-2xl border border-ringmaster-gold/20 transition-all group"
                    >
                        <ShoppingCart className="text-ringmaster-gold group-hover:scale-110 transition-transform" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-red-500/40">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative">
                {loading && !purchaseSuccess && (
                    <div className="absolute inset-0 bg-transparent backdrop-blur-sm z-10 flex items-center justify-center min-h-[400px]">
                        <Loader2 className="text-ringmaster-gold w-12 h-12 animate-spin" />
                    </div>
                )}
                
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${loading ? 'opacity-30' : ''} transition-opacity duration-300`}>
                    {items.length > 0 ? items.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-ringmaster-gold/30 hover:shadow-2xl hover:shadow-ringmaster-gold/5"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img src={item.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000"} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black text-ringmaster-gold flex items-center gap-2 border border-white/10">
                                    <Star size={14} fill="currentColor" stroke="none" /> {(item.rating || 4.5).toFixed(1)}
                                </div>
                                <div className="absolute bottom-6 left-6 flex gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${item.type === 'Hotel' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : item.type === 'Restaurant' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-white mb-2 truncate group-hover:text-ringmaster-gold transition-colors">{item.name || item.place}</h3>
                                
                                <div className="flex items-center text-gray-500 text-sm mb-6 font-bold uppercase tracking-wider">
                                    <MapPin size={14} className="mr-2 text-ringmaster-gold" /> {item.address || item.city}
                                </div>
                                
                                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{item.description || "A premium experience curated by The Ringmaster."}</p>
                                
                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Starting At</p>
                                        <span className="text-white font-black text-2xl tracking-tighter">₹{(item.price || item.cost || 5000).toLocaleString()}</span>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        disabled={cart.find(i => i.id === item.id)}
                                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                            cart.find(i => i.id === item.id)
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                                                : 'bg-white text-black hover:bg-ringmaster-gold hover:text-black shadow-lg hover:shadow-ringmaster-gold/30'
                                        }`}
                                    >
                                        {cart.find(i => i.id === item.id) ? 'Added' : 'Add to Trip'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <h3 className="text-2xl font-bold text-gray-600">No treasures found in this city.</h3>
                            <p className="text-gray-700 mt-2">Try searching for "Mumbai" or "Goa".</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Drawer - Simplified using fixed positioning */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        
                        {/* Drawer */}
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                                    <X />
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                    <ShoppingCart size={48} className="mb-4 opacity-50" />
                                    <p>Your cart is empty.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto space-y-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="bg-white/5 rounded-xl p-3 flex gap-3">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <h4 className="text-white font-semibold">{item.name}</h4>
                                                    <p className="text-sm text-gray-400">{item.location}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-purple-400">₹{item.price.toLocaleString()}</span>
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-400 text-xs hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex justify-between text-xl font-bold text-white mb-6">
                                            <span>Total</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={handleBuyNow}
                                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98]"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {purchaseSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                            <p className="text-gray-300">Items added to your purchases.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default ManualExplorer;
