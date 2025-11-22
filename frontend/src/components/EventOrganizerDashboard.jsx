import React, { useState, useEffect } from 'react';
import API from '../utils/axios.auth';
import { toast } from 'react-toastify';

const EventOrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        city: '',
        place: '',
        type: '',
        duration: '',
        image: null,
        bestTimeToVisit: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await API.get('/events/my-events');
            setEvents(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch events");
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
            formDataToSend.append('city', formData.city);
            formDataToSend.append('place', formData.place);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('duration', formData.duration);
            formDataToSend.append('bestTimeToVisit', formData.bestTimeToVisit);
            formDataToSend.append('description', formData.description);
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await API.post('/events/create', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Event created successfully");
            setFormData({
                city: '',
                place: '',
                type: '',
                duration: '',
                image: null,
                bestTimeToVisit: '',
                description: ''
            });
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await API.delete(`/events/${id}`);
                toast.success("Event deleted successfully");
                fetchEvents();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete event");
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Event Organizer Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
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
                            name="place"
                            placeholder="Place Name"
                            value={formData.place}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="type"
                            placeholder="Event Type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="duration"
                            placeholder="Duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="bestTimeToVisit"
                            placeholder="Best Time to Visit"
                            value={formData.bestTimeToVisit}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
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
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-green-300"
                        >
                            {loading ? 'Adding...' : 'Add Event'}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Events</h2>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{event.place}</h3>
                                    <p className="text-gray-600">{event.city}</p>
                                    <p className="text-gray-800 font-semibold">{event.type}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {events.length === 0 && <p>No events listed yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventOrganizerDashboard;
