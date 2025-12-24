import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";
import Resturant from "../models/resturant.model.js";
import Events from "../models/event.model.js";

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error("MONGODB connection FAILED ", err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // 1. Create a dummy Global Vendor if none exists
        let globalVendor = await User.findOne({ username: "global_vendor" });
        if (!globalVendor) {
            globalVendor = await User.create({
                UserName: "global_vendor",
                email: "vendor@ringmaster.com",
                fullname: "The Ringmaster Vendor",
                Phone: 9999999999,
                password: "dummy_password_123"
            });
            console.log("✅ Created Global Vendor User");
        }

        const vendorId = globalVendor._id;

        // 2. Clear existing collections
        await Hotel.deleteMany({});
        await Resturant.deleteMany({});
        await Events.deleteMany({});
        console.log("🗑️ Cleared existing Hotels, Restaurants, and Events");

        // 3. Seed Hotels
        const hotels = [
            {
                name: "The Royal Mirage",
                city: "Mumbai",
                address: "Juhu Tara Rd, Juhu, Mumbai, Maharashtra 400049",
                price_per_night: 8500,
                rating: 4.8,
                image: "TEXT_PLACEHOLDER: A grand coastal hotel with golden domes and luxury suites.",
                amenities: ["Ocean View", "Infinity Pool", "Spa", "Free WiFi"],
                description: "Experience royal luxury by the Arabian Sea. Our suites offer breathtaking sunset views and world-class hospitality.",
                owner: vendorId
            },
            {
                name: "Mountain Mist Retreat",
                city: "Manali",
                address: "Hadimba Temple Rd, Old Manali, Himachal Pradesh 175131",
                price_per_night: 4500,
                rating: 4.5,
                image: "TEXT_PLACEHOLDER: A cozy wooden lodge surrounded by misty pine forests and snow peaks.",
                amenities: ["Fireplace", "Trekking Guides", "Organic Cafe", "Heated Rooms"],
                description: "Escape to the serenity of the Himalayas. Perfect for nature lovers and soul seekers looking for a quiet mountain getaway.",
                owner: vendorId
            },
            {
                name: "The Urban Oasis",
                city: "Bangalore",
                address: "Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru 560001",
                price_per_night: 6000,
                rating: 4.2,
                image: "TEXT_PLACEHOLDER: A sleek glass-front skyscraper hotel with neon lighting and rooftop greenery.",
                amenities: ["Rooftop Bar", "Gym", "Business Center", "Central Location"],
                description: "Modern luxury in the heart of the Garden City. Ideal for business travelers and city explorers alike.",
                owner: vendorId
            }
        ];
        await Hotel.insertMany(hotels);
        console.log("🏨 Seeded Hotels");

        // 4. Seed Restaurants
        const restaurants = [
            {
                name: "Spice Symphony",
                cuisine: "North Indian / Buffet",
                cost_slot: "₹₹ (Mid-range)",
                rating: 4.6,
                address: "Opposite High Court, Bani Park, Jaipur, Rajasthan 302016"
            },
            {
                name: "The Sushi Zen",
                cuisine: "Japanese / Fine Dining",
                cost_slot: "₹₹₹ (Premium)",
                rating: 4.9,
                address: "Indiranagar 100 Feet Rd, Bangalore, Karnataka 560038"
            },
            {
                name: "Pasta Paradiso",
                cuisine: "Italian / Casual",
                cost_slot: "₹ (Affordable)",
                rating: 4.3,
                address: "Bandra West, Linking Road, Mumbai, Maharashtra 400050"
            }
        ];
        await Resturant.insertMany(restaurants);
        console.log("🍴 Seeded Restaurants");

        // 5. Seed Events (Shows, Fairs)
        const events = [
            {
                city: "Mumbai",
                place: "Jio World Garden",
                type: "Music Festival",
                duration: "6 PM - 11 PM (Lasts 5 hours)",
                image: "TEXT_PLACEHOLDER: Vibrant neon stage with laser lights and a cheering crowd at a music fest.",
                bestTimeToVisit: "7:30 PM for Headliner Act",
                description: "The biggest electronic dance music festival featuring global DJs and immersive art installations.",
                organizer: vendorId
            },
            {
                city: "Jaipur",
                place: "Shilpgram, Amer",
                type: "Royal Craft Fair",
                duration: "10 AM - 10 PM (All Day)",
                image: "TEXT_PLACEHOLDER: Colorful stalls of Rajasthani handicrafts, puppeteers, and folk dancers under the sun.",
                bestTimeToVisit: "Evening (6 PM) for Cultural Fairs",
                description: "Celebrate the rich heritage of Rajasthan with live crafts, folk music, and traditional Rajasthani cuisine.",
                organizer: vendorId
            },
            {
                city: "Delhi",
                place: "Pragati Maidan",
                type: "International Book Fair",
                duration: "11 AM - 8 PM (Daily)",
                image: "TEXT_PLACEHOLDER: Massive hall with thousands of bookshelves and readers browsing in a quiet atmosphere.",
                bestTimeToVisit: "Weekdays to avoid weekend rush",
                description: "A bibliophile's paradise featuring millions of books, author interactions, and literature workshops.",
                organizer: vendorId
            }
        ];
        await Events.insertMany(events);
        console.log("🎟️ Seeded Events");

        console.log("\n✨ DATABASE SEEDING COMPLETED SUCCESSFULLY ✨");
    } catch (error) {
        console.error("❌ Seeding Error:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Database Connection Closed");
    }
};

seedData();
