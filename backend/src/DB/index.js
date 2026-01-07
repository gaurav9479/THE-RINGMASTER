import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MONGO_DB connected!! DB Host ✅ :${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Standard MongoDB connection failed, trying in-memory database...", error.message);
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const connectionInstance = await mongoose.connect(uri, { dbName: DB_NAME });
            console.log(`In-Memory MONGO_DB connected!! DB Host ✅ :${connectionInstance.connection.host}`);
            // Update env for other parts of the app if needed
            process.env.MONGODB_URL = uri;
            // Seed a demo user for local development convenience
            try {
                const existing = await User.findOne({ email: "test@test.com" });
                if (!existing) {
                    await User.create({
                        UserName: "testuser",
                        email: "test@test.com",
                        fullname: "Test User",
                        Phone: 9999999999,
                        password: "Test@123",
                        role: "user"
                    });
                    console.log("✅ Seeded demo user: test@test.com / Test@123");
                }
            } catch (seedErr) {
                console.warn("Demo user seed failed:", seedErr?.message);
            }
        } catch (innerError) {
            console.log("In-memory MongoDB connection failed", innerError);
            process.exit(1);
        }
    }
}
export default connectDB;