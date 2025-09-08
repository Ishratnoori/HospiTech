import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/utilis/ApiError.js";
import cors from "cors";

const app = express();

// Load environment variables
dotenv.config({ path: "./.env" });

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import userRouter from "./src/routes/user.routes.js";
import contactUsRouter from "./src/routes/contactus.routes.js";
import appointmentRouter from "./src/routes/appointment.routes.js";
import medicineRouter from "./src/routes/medicine.routes.js";
import CartRouter from "./src/routes/UserCart.routes.js";
import PaymentRouter from "./src/routes/payment.routes.js";
import TestimonialRouter from "./src/routes/testimonial.routes.js";
import activityRouter from "./src/routes/activity.routes.js";

// Root route (for GET /)
app.get("/", (req, res) => {
  res.send("MediHub backend is running.");
});

// Route declarations
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", contactUsRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/medicines", medicineRouter);
app.use("/api/v1/medicines-cart", CartRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/testimonial", TestimonialRouter);
app.use('/api/v1/activity', activityRouter);

// Error handler
app.use(errorHandler);

export default app;
