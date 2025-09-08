import express from "express";
import {
    createPayment,
    verifyPayment,
    getPaymentDetails
} from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes
router.post("/create", isAuthenticated, createPayment);
router.post("/verify/:orderId", isAuthenticated, verifyPayment);
router.get("/:orderId", isAuthenticated, getPaymentDetails);
router.post("/checkout", isAuthenticated, createPayment);


export default router;
