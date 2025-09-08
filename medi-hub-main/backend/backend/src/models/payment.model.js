import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },
        paymentMethod: {
            type: String,
            enum: ["online", "cash"],
            default: "online"
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true
        }
    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);