import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../utils/axios.auth';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/admin/analytics/growth?days=${period}`);
            setAnalytics(response.data.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const periods = [
        { value: 7, label: '7 Days' },
        { value: 30, label: '30 Days' },
        { value: 90, label: '90 Days' },
    ];

    // Simple bar chart component
    const BarChart = ({ data, valueKey, labelKey, color }) => {
        if (!data || data.length === 0) {
            return (
                <div className="h-48 flex items-center justify-center text-gray-500">
                    No data available
                </div>
            );
        }

        const maxValue = Math.max(...data.map(d => d[valueKey]));

        return (
            <div className="h-48 flex items-end gap-1">
                {data.map((item, index) => {
                    const height = maxValue > 0 ? (item[valueKey] / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className={`w-full ${color} rounded-t-sm transition-all hover:opacity-80`}
                                style={{ height: `${height}%`, minHeight: item[valueKey] > 0 ? '4px' : '0' }}
                                title={`${item[labelKey]}: ${item[valueKey]}`}
                            />
                            <span className="text-[8px] text-gray-600 -rotate-45 origin-left whitespace-nowrap">
                                {item[labelKey]?.slice(5) || ''}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Stats summary
    const StatsSummary = ({ data, valueKey }) => {
        if (!data || data.length === 0) return null;

        const total = data.reduce((sum, d) => sum + d[valueKey], 0);
        const avg = (total / data.length).toFixed(1);
        const max = Math.max(...data.map(d => d[valueKey]));

        return (
            <div className="flex gap-6 mt-4 text-sm">
                <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="text-white font-bold ml-2">{total}</span>
                </div>
                <div>
                    <span className="text-gray-500">Avg/Day:</span>
                    <span className="text-white font-bold ml-2">{avg}</span>
                </div>
                <div>
                    <span className="text-gray-500">Peak:</span>
                    <span className="text-white font-bold ml-2">{max}</span>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Growth Analytics</h2>
                <div className="flex gap-2">
                    {periods.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                period === p.value
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">New Users</h3>
                            <p className="text-xs text-gray-500">User registrations over time</p>
                        </div>
                    </div>
                    <BarChart
                        data={analytics?.userGrowth}
                        valueKey="count"
                        labelKey="_id"
                        color="bg-blue-500"
                    />
                    <StatsSummary data={analytics?.userGrowth} valueKey="count" />
                </div>

                {/* Booking Growth */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-xl">
                            <Calendar size={20} className="text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Bookings</h3>
                            <p className="text-xs text-gray-500">Booking activity over time</p>
                        </div>
                    </div>
                    <BarChart
                        data={analytics?.bookingGrowth}
                        valueKey="count"
                        labelKey="_id"
                        color="bg-green-500"
                    />
                    <StatsSummary data={analytics?.bookingGrowth} valueKey="count" />
                </div>

                {/* Revenue */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <DollarSign size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Revenue</h3>
                            <p className="text-xs text-gray-500">Daily revenue from bookings</p>
                        </div>
                    </div>
                    <BarChart
                        data={analytics?.bookingGrowth}
                        valueKey="revenue"
                        labelKey="_id"
                        color="bg-purple-500"
                    />
                    <div className="flex gap-6 mt-4 text-sm">
                        <div>
                            <span className="text-gray-500">Total Revenue:</span>
                            <span className="text-white font-bold ml-2">
                                ${analytics?.bookingGrowth?.reduce((sum, d) => sum + (d.revenue || 0), 0).toLocaleString() || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                        <TrendingUp size={20} className="text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white">Key Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <p className="text-gray-500 text-sm">User Growth Rate</p>
                        <p className="text-2xl font-black text-white mt-1">
                            {analytics?.userGrowth?.length > 0
                                ? `+${analytics.userGrowth.reduce((sum, d) => sum + d.count, 0)}`
                                : '0'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">in last {period} days</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <p className="text-gray-500 text-sm">Booking Rate</p>
                        <p className="text-2xl font-black text-white mt-1">
                            {analytics?.bookingGrowth?.length > 0
                                ? `+${analytics.bookingGrowth.reduce((sum, d) => sum + d.count, 0)}`
                                : '0'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">bookings made</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <p className="text-gray-500 text-sm">Avg Revenue/Day</p>
                        <p className="text-2xl font-black text-white mt-1">
                            ${analytics?.bookingGrowth?.length > 0
                                ? Math.round(analytics.bookingGrowth.reduce((sum, d) => sum + (d.revenue || 0), 0) / analytics.bookingGrowth.length)
                                : '0'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">average daily</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
