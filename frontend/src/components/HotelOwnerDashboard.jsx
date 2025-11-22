import React, { useState, useEffect } from 'react';
import API from '../utils/axios.auth';
import { toast } from 'react-toastify';

const HotelOwnerDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        price_per_night: '',
        description: '',
        amenities: '',
        image: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const { data } = await API.get('/hotels/my-hotels');
            setHotels(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch hotels");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('price_per_night', formData.price_per_night);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('amenities', formData.amenities); // Backend expects string or array? Controller doesn't parse it, so string is fine if backend handles it or we split here.
            // Controller expects array for amenities? No, model has [String]. 
            // Let's split it here to be safe or send as is if backend parses.
            // Previous code: const amenitiesArray = formData.amenities.split(',').map(item => item.trim());
            // But FormData sends strings. We might need to handle array in backend or send multiple keys.
            // Simplest: send comma separated string and split in backend? 
            // Wait, previous code did: await API.post('/hotels/create', { ...formData, amenities: amenitiesArray });
            // With FormData, we can append multiple values for same key.
            const amenitiesArray = formData.amenities.split(',').map(item => item.trim());
            amenitiesArray.forEach(amenity => formDataToSend.append('amenities', amenity));

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await API.post('/hotels/create', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Hotel created successfully");
            setFormData({
                name: '',
                city: '',
                address: '',
                price_per_night: '',
                description: '',
                amenities: '',
                image: null
            });
            fetchHotels();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create hotel");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            try {
                await API.delete(`/hotels/${id}`);
                toast.success("Hotel deleted successfully");
                fetchHotels();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete hotel");
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Hotel Owner Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Add New Hotel</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
                        <input
                            type="text"
                            name="name"
                            placeholder="Hotel Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            name="price_per_night"
                            placeholder="Price per Night"
                            value={formData.price_per_night}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="amenities"
                            placeholder="Amenities (comma separated)"
                            value={formData.amenities}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? 'Adding...' : 'Add Hotel'}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Hotels</h2>
                    <div className="space-y-4">
                        {hotels.map((hotel) => (
                            <div key={hotel._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{hotel.name}</h3>
                                    <p className="text-gray-600">{hotel.city}</p>
                                    <p className="text-gray-800 font-semibold">${hotel.price_per_night}/night</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(hotel._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {hotels.length === 0 && <p>No hotels listed yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelOwnerDashboard;
