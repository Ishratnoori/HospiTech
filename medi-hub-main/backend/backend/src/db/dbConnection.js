import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(` MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(" MongoDB connection FAILED:", error);
        process.exit(1);
    }
};

export default dbConnection;

