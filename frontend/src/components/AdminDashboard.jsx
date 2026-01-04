import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Hotel, Calendar, MessageSquare,
    TrendingUp, DollarSign, UserCheck, Clock, ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/axios.auth';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import ContentModeration from './admin/ContentModeration';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await API.get('/admin/dashboard');
            setStats(response.data.data);
        } catch (error) {
            toast.error('Failed to load dashboard stats');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'moderation', label: 'Content', icon: MessageSquare },
    ];

    const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-white/5 rounded-2xl p-6"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-black text-white mt-2">{value}</p>
                    {subtext && <p className="text-xs text-gray-600 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </motion.div>
    );

    const renderOverview = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
            );
        }

        if (!stats) return null;

        return (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats.overview.totalUsers}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={Hotel}
                        label="Hotels"
                        value={stats.overview.totalHotels}
                        color="bg-purple-500"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Events"
                        value={stats.overview.totalEvents}
                        color="bg-cyan-500"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Revenue"
                        value={`$${stats.overview.totalRevenue?.toLocaleString() || 0}`}
                        color="bg-green-500"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={UserCheck}
                        label="Total Bookings"
                        value={stats.overview.totalBookings}
                        color="bg-orange-500"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Reviews"
                        value={stats.overview.totalReviews}
                        color="bg-pink-500"
                    />
                    <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-gray-500 text-sm font-medium mb-4">Booking Status</h3>
                        <div className="space-y-3">
                            {Object.entries(stats.distributions.bookingStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">{status}</span>
                                    <span className={`text-sm font-bold ${
                                        status === 'Confirmed' ? 'text-green-400' :
                                        status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white">Recent Users</h3>
                            <button
                                onClick={() => setActiveTab('users')}
                                className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                            >
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {stats.recent.users.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.fullname?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{user.fullname}</p>
                                            <p className="text-gray-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                        user.role === 'hotel_owner' ? 'bg-purple-500/20 text-purple-400' :
                                        user.role === 'event_organizer' ? 'bg-cyan-500/20 text-cyan-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white">Recent Bookings</h3>
                            <Clock size={18} className="text-gray-500" />
                        </div>
                        <div className="space-y-4">
                            {stats.recent.bookings.map((booking) => (
                                <div key={booking._id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                    <div>
                                        <p className="text-white font-medium text-sm">
                                            {booking.item?.name || booking.item?.place || 'Unknown'}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            by {booking.user?.fullname || 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-bold">${booking.totalPrice}</p>
                                        <p className={`text-xs ${
                                            booking.status === 'Confirmed' ? 'text-green-400' :
                                            booking.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>{booking.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Roles Distribution */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-6">User Distribution by Role</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(stats.distributions.userRoles).map(([role, count]) => (
                            <div key={role} className="text-center p-4 bg-black/20 rounded-xl">
                                <p className="text-2xl font-black text-white">{count}</p>
                                <p className="text-xs text-gray-500 capitalize mt-1">{role.replace('_', ' ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your platform and monitor performance</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'moderation' && <ContentModeration />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
