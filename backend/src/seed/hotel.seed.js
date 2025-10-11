import dotenv from "dotenv"
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import fs from "fs"
import path from "path"
import csv from "csv-parser"
import Hotel from "../models/hotel.model.js"
dotenv.config()

const connectDB = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log("mongoose connected")
}
const readCSV=(filepath)=>{
    return new Promise((resolve,reject)=>{
        const result=[]
        fs.createReadStream(filepath)
        .pipe(csv())
        .on("data",(row)=>{
            result.push({
                name:row.name,
                city:row.name,
                address:row.address,
                price_per_night: Number(row.price_per_night),
                rating: Number(row.rating),
                
                amenities: row.amenities ? row.amenities.split(",") : [],
                description: row.description,
            })
        })
        .on("end",()=>resolve(result))
        .on("error",(err)=>reject(err))
    })
}
const seedhotel=async()=>{
    //await connectDB()
    const csvfilepath=path.join(process.cwd(),"src","CSV","jaipur_hotels.csv")
    console.log("reading from csv",csvfilepath)
    const hotels=await readCSV(csvfilepath)
    await Hotel.deleteMany({city:"Jaipur"})
    await Hotel.insertMany(hotels)
    console.log("hotel seeded")
    mongoose.connection.close()


}
// seedhotel().catch((err)=>{
//     console.error("SEEDER failed",err)
//     mongoose.connection.close();
// })