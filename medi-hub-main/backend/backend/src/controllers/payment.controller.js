// import { instance } from "../../index.js";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

// Create a new payment
export const createPayment = asyncHandler(async (req, res, next) => {
    const { appointmentId, amount, doctorId, appointmentType } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!appointmentId || !amount || !doctorId || !appointmentType) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Check if appointment exists and belongs to the user
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: userId
    });

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ appointment: appointmentId });
    if (existingPayment) {
        throw new ApiError(400, "Payment already exists for this appointment");
    }

    // Create Razorpay order
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
        appointment: appointmentId,
        amount,
        orderId: order.id,
        status: "pending",
        paymentMethod: "online"
    });

    return res.status(200).json(
        new ApiResponse(200, { 
            paymentUrl: `/payment/${order.id}`,
            orderId: order.id,
            amount: amount,
            currency: "INR"
        }, "Payment initiated successfully")
    );
});

// Verify payment
export const verifyPayment = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { status, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Find payment record
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError(400, "Invalid payment signature");
    }

    // Update payment status
    payment.status = status;
    payment.transactionId = razorpay_payment_id;
    await payment.save();

    // Update appointment payment status
    const appointment = await Appointment.findById(payment.appointment);
    if (appointment) {
        appointment.paymentStatus = status;
        await appointment.save();
    }

    return res.status(200).json(
        new ApiResponse(200, payment, "Payment verified successfully")
    );
});

// Get payment details
export const getPaymentDetails = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId })
        .populate({
            path: "appointment",
            populate: [
                { path: "doctor", select: "firstName lastName department" },
                { path: "patient", select: "firstName lastName email" }
            ]
        });

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    return res.status(200).json(
        new ApiResponse(200, payment, "Payment details retrieved successfully")
    );
});