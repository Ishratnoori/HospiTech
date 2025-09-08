import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./src/db/dbConnection.js"; 

import app from "./app.js";

const PORT = process.env.PORT || 8000;

dbConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(" MongoDB connection failed:", err);
        process.exit(1);
    });



