// Seed data for MongoDB - Hotels and Events for Mumbai and Delhi
// Run this script using: node backend/seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Define schemas inline for seeding
const hotelSchema = new mongoose.Schema({
    name: String,
    city: String,
    address: String,
    price_per_night: Number,
    description: String,
    amenities: [String],
    image: String,
    rating: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    city: String,
    place: String,
    type: String,
    duration: String,
    image: String,
    bestTimeToVisit: String,
    description: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
const Event = mongoose.model('Event', eventSchema);

const hotels = [
    // Mumbai Hotels
    {
        name: "The Taj Mahal Palace",
        city: "Mumbai",
        address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
        price_per_night: 350,
        description: "Iconic luxury hotel overlooking the Gateway of India",
        amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym"],
        image: "https://ik.imagekit.io/o6ogodvtl/taj-palace.jpg",
        rating: 5
    },
    {
        name: "Hotel Marine Plaza",
        city: "Mumbai",
        address: "29, Marine Drive, Mumbai, Maharashtra 400020",
        price_per_night: 180,
        description: "Elegant hotel on Marine Drive with sea views",
        amenities: ["Restaurant", "WiFi", "Bar", "Room Service"],
        image: "https://ik.imagekit.io/o6ogodvtl/marine-plaza.jpg",
        rating: 4
    },
    {
        name: "The Oberoi Mumbai",
        city: "Mumbai",
        address: "Nariman Point, Mumbai, Maharashtra 400021",
        price_per_night: 400,
        description: "Luxury hotel with panoramic views of the Arabian Sea",
        amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym", "Business Center"],
        image: "https://ik.imagekit.io/o6ogodvtl/oberoi-mumbai.jpg",
        rating: 5
    },

    // Delhi Hotels
    {
        name: "The Imperial New Delhi",
        city: "Delhi",
        address: "Janpath, Connaught Place, New Delhi, Delhi 110001",
        price_per_night: 320,
        description: "Colonial-era luxury hotel in the heart of Delhi",
        amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym", "Garden"],
        image: "https://ik.imagekit.io/o6ogodvtl/imperial-delhi.jpg",
        rating: 5
    },
    {
        name: "Radisson Blu Plaza Delhi Airport",
        city: "Delhi",
        address: "National Highway 8, New Delhi, Delhi 110037",
        price_per_night: 150,
        description: "Modern hotel near airport with excellent amenities",
        amenities: ["Pool", "Restaurant", "WiFi", "Gym", "Airport Shuttle"],
        image: "https://ik.imagekit.io/o6ogodvtl/radisson-delhi.jpg",
        rating: 4
    },
    {
        name: "The Leela Palace New Delhi",
        city: "Delhi",
        address: "Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110023",
        price_per_night: 450,
        description: "Ultra-luxury hotel with royal architecture",
        amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym", "Butler Service"],
        image: "https://ik.imagekit.io/o6ogodvtl/leela-delhi.jpg",
        rating: 5
    }
];

const events = [
    // Mumbai Events
    {
        city: "Mumbai",
        place: "Gateway of India",
        type: "Historical Monument",
        duration: "2-3 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/gateway-india.jpg",
        bestTimeToVisit: "October to March",
        description: "Iconic arch monument built during British Raj, perfect for photography and boat rides"
    },
    {
        city: "Mumbai",
        place: "Marine Drive",
        type: "Scenic Promenade",
        duration: "1-2 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/marine-drive.jpg",
        bestTimeToVisit: "Evening (Sunset)",
        description: "3km long boulevard along the coast, known as Queen's Necklace"
    },
    {
        city: "Mumbai",
        place: "Elephanta Caves",
        type: "UNESCO World Heritage Site",
        duration: "Half day",
        image: "https://ik.imagekit.io/o6ogodvtl/elephanta-caves.jpg",
        bestTimeToVisit: "November to February",
        description: "Ancient rock-cut caves dedicated to Lord Shiva, accessible by ferry"
    },
    {
        city: "Mumbai",
        place: "Chhatrapati Shivaji Terminus",
        type: "Historical Railway Station",
        duration: "1 hour",
        image: "https://ik.imagekit.io/o6ogodvtl/cst-mumbai.jpg",
        bestTimeToVisit: "Year-round",
        description: "Victorian Gothic architecture, UNESCO World Heritage Site"
    },

    // Delhi Events
    {
        city: "Delhi",
        place: "Red Fort",
        type: "Historical Monument",
        duration: "2-3 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/red-fort.jpg",
        bestTimeToVisit: "October to March",
        description: "Massive Mughal fort complex, UNESCO World Heritage Site"
    },
    {
        city: "Delhi",
        place: "India Gate",
        type: "War Memorial",
        duration: "1-2 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/india-gate.jpg",
        bestTimeToVisit: "Evening",
        description: "42m tall war memorial dedicated to Indian soldiers"
    },
    {
        city: "Delhi",
        place: "Qutub Minar",
        type: "UNESCO World Heritage Site",
        duration: "2 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/qutub-minar.jpg",
        bestTimeToVisit: "October to March",
        description: "73m tall minaret, finest example of Indo-Islamic architecture"
    },
    {
        city: "Delhi",
        place: "Lotus Temple",
        type: "Architectural Marvel",
        duration: "1-2 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/lotus-temple.jpg",
        bestTimeToVisit: "Year-round",
        description: "Bahá'í House of Worship shaped like a lotus flower"
    },
    {
        city: "Delhi",
        place: "Humayun's Tomb",
        type: "UNESCO World Heritage Site",
        duration: "2 hours",
        image: "https://ik.imagekit.io/o6ogodvtl/humayuns-tomb.jpg",
        bestTimeToVisit: "October to March",
        description: "Magnificent Mughal architecture, inspiration for Taj Mahal"
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Hotel.deleteMany({ city: { $in: ['Mumbai', 'Delhi'] } });
        await Event.deleteMany({ city: { $in: ['Mumbai', 'Delhi'] } });
        console.log('Cleared existing Mumbai and Delhi data');

        // Insert new data
        await Hotel.insertMany(hotels);
        console.log(`Inserted ${hotels.length} hotels`);

        await Event.insertMany(events);
        console.log(`Inserted ${events.length} events`);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
