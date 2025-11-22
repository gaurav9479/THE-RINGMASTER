import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MongoMemoryServer } from "mongodb-memory-server";

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
        } catch (innerError) {
            console.log("In-memory MongoDB connection failed", innerError);
            process.exit(1);
        }
    }
}
export default connectDB;