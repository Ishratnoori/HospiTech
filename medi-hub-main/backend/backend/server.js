import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./src/routes/user.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/activity", activityRoutes);

// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "It works!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medihub")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
