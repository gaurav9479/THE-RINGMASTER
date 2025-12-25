import React, { useState } from 'react';
import { 
    LayoutDashboard, PlusCircle, Users, Calendar, MapPin, 
    Clock, Image as ImageIcon, CheckCircle, CreditCard, 
    Settings, Edit3, Trash2, QrCode, Banknote, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/axios.auth';
import { useEffect } from 'react';

function VendorDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Mock Data for Payments
    const [paymentInfo, setPaymentInfo] = useState({
        bankName: 'HDFC Bank',
        accountNumber: 'XXXX XXXX 5678',
        ifsc: 'HDFC0001234',
        qrPlaceholder: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TheRingmasterVendor'
    });

    // Mock Data for Listings
    const [listings, setListings] = useState([
        { id: 1, name: "The Royal Mirage", type: "Hotel", city: "Mumbai", price: 8500, rating: 4.8 },
        { id: 2, name: "Spice Symphony", type: "Restaurant", city: "Jaipur", price: 1500, rating: 4.6 },
        { id: 3, name: "Sunset Dinner", type: "Event", city: "Goa", price: 2500, rating: 4.9 }
    ]);

    const [editingListing, setEditingListing] = useState(null);

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

    const handlePaymentUpdate = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleEditListing = (listing) => {
        setEditingListing(listing);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setListings(prev => prev.map(l => l.id === editingListing.id ? editingListing : l));
        setEditingListing(null);
        alert("Listing updated successfully!");
    };

    const fetchVendorData = async () => {
        setLoading(true);
        try {
            const response = await API.get("/bookings/vendor");
            const bookings = response.data.data;
            setCustomers(bookings.map(b => ({
                id: b._id,
                name: b.user?.username || "Guest",
                event: b.item?.name || b.item?.place || "Unknown Item",
                date: new Date(b.bookingDate).toLocaleDateString(),
                status: b.status,
                phone: b.user?.phone || "N/A"
            })));
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorData();
    }, []);

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
                    <button 
                        onClick={() => setActiveTab('listings')}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'listings' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Settings size={20} className="mr-3" />
                        Manage Listings
                    </button>
                    <button 
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <CreditCard size={20} className="mr-3" />
                        Payments
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
                    <h2 className="text-3xl font-bold italic">
                        {activeTab === 'overview' && '🎩 Dashboard Overview'}
                        {activeTab === 'create-event' && '✨ Create New Event'}
                        {activeTab === 'customers' && '👥 Customer Bookings'}
                        {activeTab === 'listings' && '📂 Manage Listings'}
                        {activeTab === 'payments' && '💰 Payment & Bank Details'}
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
                        <div className="bg-gray-800 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-bold mb-6">All Customer Bookings</h3>
                            {loading ? (
                                <div className="text-center py-10 text-gray-400">Loading bookings...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="text-left text-gray-400 text-sm uppercase tracking-wider border-b border-white/10">
                                                <th className="p-4 px-6">Customer Name</th>
                                                <th className="p-4 px-6">Event/Item</th>
                                                <th className="p-4 px-6">Date</th>
                                                <th className="p-4 px-6">Phone</th>
                                                <th className="p-4 px-6">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                        {customers.map((customer) => (
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
                            )}
                            {customers.length === 0 && !loading && (
                                <div className="p-8 text-center text-gray-500">
                                    No bookings found.
                                </div>
                            )}
                        </div>
                    )}

                    {/* MANAGE LISTINGS TAB */}
                    {activeTab === 'listings' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {listings.map((listing) => (
                                    <div key={listing.id} className="bg-gray-800 p-6 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-blue-500/50 transition-all">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-blue-400">
                                                {listing.type === 'Hotel' ? <Calendar size={24} /> : listing.type === 'Restaurant' ? <Users size={24} /> : <MapPin size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold">{listing.name}</h4>
                                                <p className="text-sm text-gray-500">{listing.city} • {listing.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Starting at</p>
                                                <p className="text-xl font-black text-green-400">₹{listing.price.toLocaleString()}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleEditListing(listing)}
                                                className="p-3 bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-xl transition-all"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <AnimatePresence>
                                {editingListing && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                                    >
                                        <motion.div 
                                            initial={{ scale: 0.9, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            className="bg-gray-800 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl"
                                        >
                                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                                <Edit3 className="text-blue-400" /> Edit Listing
                                            </h3>
                                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                                                    <input 
                                                        type="number" 
                                                        value={editingListing.price}
                                                        onChange={(e) => setEditingListing({...editingListing, price: parseInt(e.target.value)})}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                                    <textarea 
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                                        placeholder="Update listing description..."
                                                    />
                                                </div>
                                                <div className="flex gap-4 mt-8">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setEditingListing(null)}
                                                        className="flex-1 px-6 py-4 bg-gray-700 rounded-2xl font-bold hover:bg-gray-600 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        type="submit"
                                                        className="flex-1 px-6 py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Save size={18} /> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === 'payments' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-800 p-8 rounded-3xl border border-white/10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                        <Banknote size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Bank Account Details</h3>
                                        <p className="text-gray-500 text-sm italic">Where you receive your payouts</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bank Name</label>
                                        <input 
                                            type="text" name="bankName" value={paymentInfo.bankName} onChange={handlePaymentUpdate}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Number</label>
                                        <input 
                                            type="text" name="accountNumber" value={paymentInfo.accountNumber} onChange={handlePaymentUpdate}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">IFSC Code</label>
                                        <input 
                                            type="text" name="ifsc" value={paymentInfo.ifsc} onChange={handlePaymentUpdate}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10">
                                        Update Bank Info
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700">
                                    <QrCode size={200} />
                                </div>
                                
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">Payment QR Code</h3>
                                    <p className="text-gray-500 text-sm">Scan to pay directly to vendor account</p>
                                </div>

                                <div className="bg-white p-4 rounded-3xl shadow-2xl relative z-10">
                                    <img src={paymentInfo.qrPlaceholder} alt="QR Code" className="w-48 h-48" />
                                </div>

                                <button className="flex items-center gap-3 px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                                    <PlusCircle size={18} /> Generate New QR
                                </button>
                                
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[4px] mt-4">Verified by THE RINGMASTER Pay</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default VendorDashboard;
