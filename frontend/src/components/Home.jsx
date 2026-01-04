import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { User, Store, ArrowRight, Star, Shield, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser } from '../utils/axios.auth';
import { toast } from 'react-toastify';

function Home() {
    const { setIsLoginOpen, setIsRegisterOpen, isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const [loadingDemo, setLoadingDemo] = useState(null);

    // Redirect to dashboard if already logged in (optional but good UX)
    React.useEffect(() => {
        if (isLoggedIn) {
             navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);

    const openLogin = () => setIsLoginOpen(true);
    const openRegister = () => setIsRegisterOpen(true);

    const handleDemoLogin = async (type) => {
        const credentials = {
            traveler: { email: 'test@test.com', password: 'Test@123' },
            vendor: { email: 'vendor@test.com', password: 'Vendor@123' },
            admin: { email: 'admin@test.com', password: 'Admin@123' }
        };

        setLoadingDemo(type);
        try {
            const { data } = await loginUser(credentials[type]);
            localStorage.setItem('accessToken', data.accesstoken);
            localStorage.setItem('refreshToken', data.refreshtoken);
            login(data.user);
            toast.success(`Logged in as ${type}!`);

            // Navigate based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else if (data.user.role === 'hotel_owner' || data.user.role === 'event_organizer') {
                navigate('/vendor-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error('Demo login failed. Please try manual login.');
            console.error(err);
        } finally {
            setLoadingDemo(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 px-4 py-16 md:py-24 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen">
                
                {/* Hero Header */}
                <div className="text-center mb-16 space-y-6 max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        The Ringmaster
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        Your ultimate platform for seamless travel experiences and business growth.
                    </p>
                </div>

                {/* Main Split Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    
                    {/* User Section */}
                    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <User size={32} />
                            </div>
                            <h2 className="text-3xl font-bold">For Travelers</h2>
                        </div>
                        
                        <p className="text-gray-400 mb-8 h-20">
                            Discover the world's best hotels, restaurants, and hidden gems. Plan your next adventure with ease and style.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={openLogin}
                                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-purple-600/30 flex items-center justify-center gap-2"
                            >
                                Login
                            </button>
                            <button 
                                onClick={openRegister}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                Register <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Vendor Section */}
                    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Store size={32} />
                            </div>
                            <h2 className="text-3xl font-bold">For Vendors</h2>
                        </div>
                        
                        <p className="text-gray-400 mb-8 h-20">
                            Grow your business by listing your hotel or restaurant. Connect with millions of travelers and manage your bookings.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={openLogin}
                                className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                            >
                                Vendor Login
                            </button>
                            <button 
                                onClick={openRegister}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                Submit Request <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Demo Accounts */}
                <div className="mt-12 w-full max-w-4xl">
                    <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-center text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                            <span className="text-yellow-400">★</span> Quick Demo Login <span className="text-yellow-400">★</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <button
                                onClick={() => handleDemoLogin('traveler')}
                                disabled={loadingDemo !== null}
                                className="bg-white/5 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-pointer text-left group disabled:opacity-50 disabled:cursor-wait"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-purple-400 font-semibold">Traveler</p>
                                    {loadingDemo === 'traveler' ? (
                                        <Loader2 size={16} className="animate-spin text-purple-400" />
                                    ) : (
                                        <ArrowRight size={16} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs">test@test.com</p>
                                <p className="text-gray-400 text-xs mt-1">Click to login instantly</p>
                            </button>
                            <button
                                onClick={() => handleDemoLogin('vendor')}
                                disabled={loadingDemo !== null}
                                className="bg-white/5 rounded-xl p-4 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer text-left group disabled:opacity-50 disabled:cursor-wait"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-blue-400 font-semibold">Vendor</p>
                                    {loadingDemo === 'vendor' ? (
                                        <Loader2 size={16} className="animate-spin text-blue-400" />
                                    ) : (
                                        <ArrowRight size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs">vendor@test.com</p>
                                <p className="text-gray-400 text-xs mt-1">Click to login instantly</p>
                            </button>
                            <button
                                onClick={() => handleDemoLogin('admin')}
                                disabled={loadingDemo !== null}
                                className="bg-white/5 rounded-xl p-4 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all cursor-pointer text-left group disabled:opacity-50 disabled:cursor-wait"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-red-400 font-semibold">Admin</p>
                                    {loadingDemo === 'admin' ? (
                                        <Loader2 size={16} className="animate-spin text-red-400" />
                                    ) : (
                                        <ArrowRight size={16} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs">admin@test.com</p>
                                <p className="text-gray-400 text-xs mt-1">Click to login instantly</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Footer */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-4xl">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Globe className="text-purple-400 mb-2" size={24} />
                        <h3 className="text-white font-semibold">Global Reach</h3>
                        <p className="text-sm">Access destinations worldwide</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Shield className="text-blue-400 mb-2" size={24} />
                        <h3 className="text-white font-semibold">Secure Booking</h3>
                        <p className="text-sm">Safe and encrypted transactions</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Star className="text-yellow-400 mb-2" size={24} />
                        <h3 className="text-white font-semibold">Premium Experience</h3>
                        <p className="text-sm">Curated selection of best spots</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;