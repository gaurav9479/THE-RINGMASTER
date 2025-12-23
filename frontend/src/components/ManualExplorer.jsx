import React, { useState } from 'react';
import { ShoppingCart, Star, MapPin, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const VENDOR_ITEMS = [
    {
        id: 1,
        name: "Grand Royal Hotel",
        type: "Hotel",
        rating: 4.8,
        location: "Mumbai, India",
        price: 12000,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        description: "Luxury stay with ocean view and premium amenities."
    },
    {
        id: 2,
        name: "Spice Garden",
        type: "Restaurant",
        rating: 4.5,
        location: "Delhi, India",
        price: 2500,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
        description: "Authentic Indian cuisine with a modern twist."
    },
    {
        id: 3,
        name: "Mountain Retreat",
        type: "Hotel",
        rating: 4.9,
        location: "Manali, India",
        price: 8500,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000",
        description: "Cozy wooden cottages amidst snow-capped peaks."
    },
    {
        id: 4,
        name: "Ocean Blue Bistro",
        type: "Restaurant",
        rating: 4.3,
        location: "Goa, India",
        price: 1800,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1000",
        description: "Fresh seafood by the beach."
    }
];

function ManualExplorer() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const addToCart = (item) => {
        if (!cart.find(i => i.id === item.id)) {
            setCart([...cart, item]);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleBuyNow = () => {
        // Simulate Purchase
        setPurchaseSuccess(true);
        setTimeout(() => {
            setPurchaseSuccess(false);
            setCart([]);
            setIsCartOpen(false);
            // Here you would typically save to "My Trips" or backend
            console.log("Purchased items:", cart);
        }, 2000);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Explore & Book
                    </h1>
                    <p className="text-gray-400 mt-1">Discover places and add them to your trip.</p>
                </div>
                
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <ShoppingCart className="text-white" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VENDOR_ITEMS.map((item) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-sm text-yellow-400 flex items-center gap-1">
                                <Star size={14} fill="currentColor" /> {item.rating}
                            </div>
                        </div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Hotel' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                    {item.type}
                                </span>
                            </div>
                            
                            <div className="flex items-center text-gray-400 text-sm mb-4">
                                <MapPin size={14} className="mr-1" /> {item.location}
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                            
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-white font-bold text-lg">₹{item.price.toLocaleString()}</span>
                                <button 
                                    onClick={() => addToCart(item)}
                                    disabled={cart.find(i => i.id === item.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        cart.find(i => i.id === item.id)
                                            ? 'bg-green-500/20 text-green-400 cursor-default'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                >
                                    {cart.find(i => i.id === item.id) ? 'Added' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
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
