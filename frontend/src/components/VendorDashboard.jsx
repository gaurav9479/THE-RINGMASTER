import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Users, Calendar, MapPin, Clock, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function VendorDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    
    // Mock Data for Customers
    const CUSTOMERS = [
        { id: 1, name: "Rahul Sharma", event: "Sunset Dinner", date: "2024-12-25", status: "Confirmed", phone: "+91 98765 43210" },
        { id: 2, name: "Priya Patel", event: "Mountain Trek", date: "2024-12-28", status: "Pending", phone: "+91 91234 56789" },
        { id: 3, name: "Amit Singh", event: "Live Music Night", date: "2024-12-30", status: "Completed", phone: "+91 88997 76655" },
        { id: 4, name: "Sneha Gupta", event: "Cooking Workshop", date: "2025-01-05", status: "Confirmed", phone: "+91 77665 54433" },
    ];

    // Form State
    const [eventFiles, setEventFiles] = useState({
        city: '',
        place: '',
        type: '',
        duration: '',
        image: '',
        bestTimeToVisit: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventFiles(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Event Details Submitted:", eventFiles);
        // Here you would call the backend API to create the event
        alert("Event Created Successfully! (Mock)");
        setEventFiles({
            city: '',
            place: '',
            type: '',
            duration: '',
            image: '',
            bestTimeToVisit: '',
            description: ''
        });
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-white/10 p-6 flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-10">
                    Vendor Portal
                </h1>
                
                <nav className="flex-1 space-y-4">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} className="mr-3" />
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('create-event')}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'create-event' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <PlusCircle size={20} className="mr-3" />
                        Create Event
                    </button>
                    <button 
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'customers' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Users size={20} className="mr-3" />
                        Customers
                    </button>
                </nav>
                
                <div className="pt-6 border-t border-white/10 text-sm text-gray-500">
                    Logged in as Vendor
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-900 relative">
                
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'create-event' && 'Create New Event'}
                        {activeTab === 'customers' && 'Customer Bookings'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">V</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="max-w-5xl mx-auto">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400 mb-2">Total Events</h3>
                                <div className="text-4xl font-bold text-white">12</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400 mb-2">Total Bookings</h3>
                                <div className="text-4xl font-bold text-white">48</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400 mb-2">Revenue</h3>
                                <div className="text-4xl font-bold text-green-400">₹85,000</div>
                            </div>
                            
                            <div className="col-span-1 md:col-span-3 bg-gray-800 p-8 rounded-2xl border border-white/10 mt-6">
                                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-full text-green-400"><CheckCircle size={16} /></div>
                                            <span>New booking for "Sunset Dinner"</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">2 mins ago</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><PlusCircle size={16} /></div>
                                            <span>Event "Mountain Trek" created</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CREATE EVENT TAB */}
                    {activeTab === 'create-event' && (
                        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl border border-white/10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <MapPin size={16} /> City
                                    </label>
                                    <input 
                                        type="text" name="city" required value={eventFiles.city} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mumbai"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <MapPin size={16} /> Place / Venue
                                    </label>
                                    <input 
                                        type="text" name="place" required value={eventFiles.place} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Taj Lands End"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <LayoutDashboard size={16} /> Event Type
                                    </label>
                                    <select 
                                        name="type" required value={eventFiles.type} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Concert">Concert</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Food & Drink">Food & Drink</option>
                                        <option value="Adventure">Adventure</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Clock size={16} /> Duration
                                    </label>
                                    <input 
                                        type="text" name="duration" required value={eventFiles.duration} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 3 Hours"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Calendar size={16} /> Best Time to Visit
                                    </label>
                                    <input 
                                        type="text" name="bestTimeToVisit" value={eventFiles.bestTimeToVisit} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Evening, Winter"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <ImageIcon size={16} /> Image URL
                                    </label>
                                    <input 
                                        type="url" name="image" value={eventFiles.image} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        Description
                                    </label>
                                    <textarea 
                                        name="description" required value={eventFiles.description} onChange={handleInputChange} rows="4"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe your event..."
                                    />
                                </div>

                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-600/30">
                                Publish Event
                            </button>
                        </form>
                    )}

                    {/* CUSTOMERS TAB */}
                    {activeTab === 'customers' && (
                        <div className="bg-gray-800 rounded-2xl border border-white/10 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="p-4 px-6">Customer Name</th>
                                            <th className="p-4 px-6">Event</th>
                                            <th className="p-4 px-6">Date</th>
                                            <th className="p-4 px-6">Phone</th>
                                            <th className="p-4 px-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {CUSTOMERS.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 px-6 font-medium text-white">{customer.name}</td>
                                                <td className="p-4 px-6 text-gray-300">{customer.event}</td>
                                                <td className="p-4 px-6 text-gray-300">{customer.date}</td>
                                                <td className="p-4 px-6 text-gray-300">{customer.phone}</td>
                                                <td className="p-4 px-6">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                        ${customer.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 
                                                          customer.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                        {customer.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {CUSTOMERS.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    No bookings found.
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default VendorDashboard;
