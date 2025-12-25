import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Wind, Sun, Umbrella, Camera, Zap } from 'lucide-react';

const MagicPackingList = ({ vibe, destination }) => {
    const getSuggestions = () => {
        const base = ["Passport & ID", "Mobile Charger", "Universal Adapter", "Toiletries Bag"];
        
        const vibeMagic = {
            "Adventure": ["Hiking Boots", "Waterproof Jacket", "First Aid Kit", "Energy Bars"],
            "Relaxing": ["Sunscreen", "Beach Towel", "Novels", "Noise-Cancelling Headphones"],
            "Culture": ["Comfortable Walking Shoes", "Journal", "Local Language Phrasebook", "Scarf (for temples)"],
            "Party": ["Glitter/Makeup", "Portable Speaker", "Energy Drinks", "Dancing Shoes"]
        };

        const extraMagic = ["Portable Battery", "Polaroid Camera", "Insta-worthy Outfits", "Travel Insurance"];

        return {
            essentials: base,
            specialized: vibeMagic[vibe] || vibeMagic["Relaxing"],
            extras: extraMagic
        };
    };

    const list = getSuggestions();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-901 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShoppingBag size={120} />
            </div>

            <div className="relative z-10 space-y-8">
                <header className="flex items-center gap-4">
                    <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic">Magic Packing List</h2>
                        <p className="text-gray-500 font-medium">Curated for your {vibe} trip to {destination}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Essentials */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Essentials
                        </h3>
                        <div className="space-y-2">
                            {list.essentials.map((item, i) => (
                                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-sm border border-transparent hover:border-white/10">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Specialized */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Sun size={16} /> Gear Up
                        </h3>
                        <div className="space-y-2">
                            {list.specialized.map((item, i) => (
                                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center gap-3 p-3 bg-cyan-500/10 rounded-xl text-sm border border-cyan-500/20 text-cyan-100">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Extras */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Camera size={16} /> Fun Stuff
                        </h3>
                        <div className="space-y-2">
                            {list.extras.map((item, i) => (
                                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-xl text-sm border border-purple-500/20 text-purple-100">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MagicPackingList;
