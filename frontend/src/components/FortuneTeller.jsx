import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Moon, Sun, Ghost } from 'lucide-react';

const FortuneTeller = () => {
    const [fortune, setFortune] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const timeoutRef = useRef(null);

    const fortunes = [
        { text: "A hidden gem in the mountains awaits your discovery.", icon: <Sun className="text-yellow-400" /> },
        { text: "Pack light, but carry heavy memories.", icon: <Zap className="text-cyan-400" /> },
        { text: "The ocean waves have a message for you this season.", icon: <Moon className="text-blue-400" /> },
        { text: "A spontaneous road trip will bring unexpected joy.", icon: <Sparkles className="text-purple-400" /> },
        { text: "You will find the best street food in a narrow alley.", icon: <Ghost className="text-white" /> },
        { text: "Your next flight will have an empty seat beside you.", icon: <Zap className="text-green-400" /> }
    ];

    // Cleanup timeout on unmount to prevent memory leak
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getFortune = () => {
        setIsThinking(true);
        setFortune(null);
        timeoutRef.current = setTimeout(() => {
            const random = fortunes[Math.floor(Math.random() * fortunes.length)];
            setFortune(random);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="relative group">
            {/* The Crystal Ball Visual */}
            <div 
                onClick={getFortune}
                className="relative w-48 h-48 mx-auto cursor-pointer"
            >
                {/* Glow Effects */}
                <div className="absolute inset-0 bg-purple-600/30 blur-[60px] rounded-full animate-pulse group-hover:bg-cyan-600/40" />
                
                {/* Outer Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-dashed border-white/20 rounded-full"
                />

                {/* The Ball */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-black rounded-full border border-white/20 flex flex-col items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,1)] overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {isThinking ? (
                            <motion.div 
                                key="thinking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <Sparkles className="text-white animate-spin" size={32} />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-300">Consulting Stars...</span>
                            </motion.div>
                        ) : !fortune ? (
                            <motion.div 
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <Moon className="text-white/40" size={48} />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">Tapt the Orb</span>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="fortune"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-4 text-center"
                            >
                                <div className="mb-2 flex justify-center">{fortune.icon}</div>
                                <p className="text-xs font-bold leading-tight text-white">{fortune.text}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reflection overlay */}
                    <div className="absolute top-4 left-4 w-12 h-6 bg-white/10 rounded-full blur-md rotate-[-45deg]" />
                </motion.div>
            </div>
            
            <p className="mt-6 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Travel Fortune Teller</p>
        </div>
    );
};

export default FortuneTeller;
