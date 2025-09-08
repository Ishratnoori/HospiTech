import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
    patient: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
    },
        appointmentType: {
        type: String,
            enum: ["digital", "hospital"],
            required: true
    },
        appointmentDate: {
            type: Date,
            required: true
    },
    city: {
        type: String,
            required: true
    },
    pincode: {
        type: String,
            required: true
    },
    department: {
        type: String,
            required: true
    },
    status: {
        type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);