import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import fs from "fs"
import path from "path";
import dotenv from "dotenv"
import csv from "csv-parser";
import Resturant from "../models/resturant.model.js";
dotenv.config()


const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("mongnoo bingooo")
    } catch (err) {
        console.error("mongo didn't connectedd", err)
        process.exit(1);
    }
}
const readCSV = (filepath) => {
    return new Promise((resolve, reject) => {
        const result = [];
        fs.createReadStream(filepath)
            .pipe(csv())
            .on("data", (row) => {
                result.push({
                    name: row.name,
                    cuisine: row.cuisine,
                    cost_slot: row.cost_slot,
                    rating: Number(row.rating),
                    address: row.address,
                });
            })
            .on("end", () => resolve(result))
            .on("error", (err) => reject(err))
    })
}
const seedresturant = async () => {
    await connectDB()
    const csvfilepath = path.join(process.cwd(), "src", "CSV", "jaipur_restaurants.csv")

    console.log("reading the csv", csvfilepath)
    const resturants = await readCSV(csvfilepath)
    await Resturant.deleteMany({})
    await Resturant.insertMany(resturants)
    console.log("resturant seeded")
    mongoose.connection.close();
}
seedresturant().catch((err) => {
    console.log("SEEDER FAILED", err)
    mongoose.connection.close();
})