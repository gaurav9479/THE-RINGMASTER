import fs from "fs";
import path from "path";
import { parse } from "json2csv";

const hotels = [
    ["Taj Jai Mahal Palace", "Jaipur", "Jaipur Amer Rd", 8000, 5, "Pool, WiFi, Spa, Gym", "Luxury hotel blending heritage and modern comfort."],
    ["ITC Rajputana", "Jaipur", "Sawai Jai Singh Highway", 7500, 5, "Pool, WiFi, Restaurant, Spa", "Heritage property offering royal experience and fine dining."],
    ["Shahpura House", "Jaipur", "Shahpura Bagh Rd", 4500, 4, "WiFi, Restaurant, Spa", "Boutique hotel with traditional Rajasthani decor."],
    ["Alsisar Haveli", "Jaipur", "Alsisar Rd", 5000, 4, "WiFi, Restaurant, Courtyard", "Heritage haveli with royal ambiance and courtyard dining."],
    ["Fairfield by Marriott", "Jaipur", "Jawahar Lal Nehru Marg", 4000, 4, "Pool, WiFi, Gym, Restaurant", "Modern hotel suitable for business and leisure travelers."],
    ["Hilton Jaipur", "Jaipur", "Airport Rd", 6000, 5, "Pool, WiFi, Gym, Restaurant, Spa", "International brand with luxury amenities and rooftop pool."],
    ["Trident", "Jaipur", "Airport Rd", 7000, 5, "Pool, WiFi, Spa, Restaurant", "Premium hotel offering royal Rajasthani hospitality."],
    ["Radisson Blu Jaipur", "Jaipur", "Jaipur Sanganer Rd", 5500, 4, "Pool, WiFi, Gym, Restaurant", "Comfortable rooms with modern facilities and banquet halls."],
    ["Marriott Jaipur", "Jaipur", "Jaipur Sanganer Rd", 6500, 5, "Pool, WiFi, Gym, Spa, Restaurant", "Luxury property with scenic views and excellent service."],
    ["Hotel Pearl Palace", "Jaipur", "MI Rd", 3000, 3, "WiFi, Restaurant", "Budget-friendly heritage hotel with vibrant interiors."]
];

// Convert to array of objects
const hotelObjects = hotels.map(([name, city, address, price_per_night, rating, amenities, description]) => ({
    name,
    city,
    address,
    price_per_night,
    rating,
    amenities,
    description
}));

// Fields for CSV
const fields = ["name", "city", "address", "price_per_night", "rating", "amenities", "description"];
const opts = { fields };

// Parse to CSV
const csv = parse(hotelObjects, opts);

// Save CSV file
const filePath = path.join(process.cwd(), "src", "CSV", "jaipur_hotels.csv");
fs.writeFileSync(filePath, csv);

console.log("✅ CSV file created at", filePath);
