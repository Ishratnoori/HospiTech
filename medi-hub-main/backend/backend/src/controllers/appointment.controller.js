import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";

// Controller function for booking an appointment
export const bookAppointment = asyncHandler(async (req, res, next) => {
    const patientId = req.user._id; // Get patient ID from authenticated user
    const { doctorId, city, pincode, appointmentDate, department, appointmentType } = req.body;

    // Check if all required fields are provided
    if (!doctorId || !city || !pincode || !appointmentDate || !department || !appointmentType) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Get doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // Check if appointment already exists for this patient and doctor at the same time
    const appointmentDateTime = new Date(appointmentDate);
    const startOfDay = new Date(appointmentDateTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDateTime);
    endOfDay.setHours(23, 59, 59, 999);

    const existedAppointment = await Appointment.findOne({
        patient: patientId,
        doctor: doctorId,
        appointmentDate: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    if (existedAppointment) {
        throw new ApiError(400, "You already have an appointment with this doctor on this day. Please choose a different day.");
    }

    // Create the appointment
    const createdAppointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        appointmentType,
        appointmentDate: new Date(appointmentDate),
        city,
        pincode,
        department,
        amount: Number(doctor.appointmentCharges)
    });

    return res.status(201).json(
        new ApiResponse(201, createdAppointment, "Appointment booked successfully!")
    );
});

// Controller function for getting all appointments
export const getAllAppointments = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Please login to view appointments");
    }

    let appointments;
    if (user.role === "Patient") {
        // If user is a patient, get only their appointments
        appointments = await Appointment.find({ patient: user._id })
            .populate("doctor", "firstName lastName department appointmentCharges")
            .sort({ appointmentDate: -1 });
    } else if (user.role === "Doctor") {
        // If user is a doctor, get only their appointments
        appointments = await Appointment.find({ doctor: user._id })
            .populate("patient", "firstName lastName")
            .sort({ appointmentDate: -1 });
    } else if (user.role === "Admin") {
        // If user is an admin, get all appointments
        appointments = await Appointment.find()
            .populate("patient", "firstName lastName")
            .populate("doctor", "firstName lastName department")
            .sort({ appointmentDate: -1 });
    } else {
        throw new ApiError(403, "Unauthorized role");
    }

    // Ensure we're returning an array even if no appointments are found
    if (!appointments) {
        appointments = [];
    }

    res.status(200).json(
        new ApiResponse(200, appointments, "Appointments retrieved successfully")
    );
});

// Controller function for updating appointment status
export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    // Only doctors can update appointment status
    if (req.user.role !== "Doctor") {
        throw new ApiError(403, "Only doctors can update appointment status");
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(
        new ApiResponse(200, appointment, "Appointment status updated successfully")
    );
});

// Delete appointment
export const deleteAppointment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
        throw new ApiError(400, "Appointment ID is required");
    }

    // Find appointment and check if it belongs to the user
    const appointment = await Appointment.findOne({
        _id: id,
        patient: userId
    });

    if (!appointment) {
        throw new ApiError(404, "Appointment not found or you don't have permission to cancel this appointment");
    }

    // Only allow cancellation of pending appointments
    if (appointment.status !== "pending") {
        throw new ApiError(400, "Only pending appointments can be cancelled");
    }

    try {
        // Delete the appointment
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        
        if (!deletedAppointment) {
            throw new ApiError(404, "Failed to delete appointment");
        }

        return res.status(200).json(
            new ApiResponse(200, null, "Appointment cancelled successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error cancelling appointment: " + error.message);
    }
});