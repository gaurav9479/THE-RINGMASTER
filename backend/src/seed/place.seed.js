import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import csv from "csv-parser";
import dotenv from "dotenv";
import ImageKit from "imagekit";
import Event from "../models/event.model.js";
import {DB_NAME} from "../constants.js"

dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};


// const imagekit = new ImageKit({
//     publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGE_KIT_URL,
// });


// const uploadImage = async (localFilePath, fileName) => {
//     try {
//         const fileBuffer = fs.readFileSync(localFilePath);
//         const base64 = fileBuffer.toString("base64");

//         const uploadResponse = await imagekit.upload({
//             file: base64,
//             fileName,
//         });

//         console.log(`✅ Uploaded: ${fileName}`);
//         return uploadResponse.url;
//     } catch (error) {
//         console.error(`⚠️ Upload failed (${fileName}):`, error.message);
//         return null;
//     }
// };


const seedPlaces = async () => {
    //await connectDB();

    const csvPath = path.join(process.cwd(),"src", "CSV", "jaipur_places.csv");
    console.log(`📂 Reading CSV from: ${csvPath}`);

    const places = [];

    fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
            places.push(row);
        })
        .on("end", async () => {
            console.log(`🧾 Found ${places.length} rows`);

            const eventDocs = [];

            for (const place of places) {
                const imageFile = path.join(process.cwd(), "src", "CSV", place.image);

                if (!fs.existsSync(imageFile)) {
                    console.warn(`⚠️ Image not found locally: ${place.image}`);
                    continue;
                }

                const imageUrl = await uploadImage(imageFile, place.image);

                if (!imageUrl) continue;

                eventDocs.push({
                    city: place.city || "Jaipur",
                    place: place.place,
                    type: place.type || "Tourist Spot",
                    duration: place.duration || "2 hrs",
                    image: imageUrl,
                    bestTimeToVisit: place.bestTimeToVisit || "October - March",
                    description: place.description || "A beautiful place to visit in Jaipur.",
                });
            }

            if (eventDocs.length > 0) {
                await Event.insertMany(eventDocs);
                console.log(`🎉 Inserted ${eventDocs.length} places into MongoDB`);
            } else {
                console.log("⚠️ No valid places inserted.");
            }

            mongoose.connection.close();
        });
};

// seedPlaces();
