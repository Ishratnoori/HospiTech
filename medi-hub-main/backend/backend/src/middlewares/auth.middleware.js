import jwt from "jsonwebtoken";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

// General JWT verification middleware
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.cookies.patientToken || req.cookies.doctorToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Access!");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
        
        // Try to find user first
        const user = await User.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }

        // If not found in User model, try Doctor model
        const doctor = await Doctor.findById(decoded.id);
        if (doctor) {
            req.user = doctor;
            return next();
        }

        throw new ApiError(401, "Invalid token or user not found!");
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token!");
    }
};

// General authentication middleware that checks for any valid token
const isAuthenticated = async (req, res, next) => {
    try {
        // Check for admin token
        const adminToken = req.cookies.adminToken;
        if (adminToken) {
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Check for patient token
        const patientToken = req.cookies.patientToken;
        if (patientToken) {
            const decoded = jwt.verify(patientToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Check for doctor token
        const doctorToken = req.cookies.doctorToken;
        if (doctorToken) {
            const decoded = jwt.verify(doctorToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
            const doctor = await Doctor.findById(decoded.id);
            if (doctor) {
                req.user = doctor;
                return next();
            }
        }

        // If no valid token is found, throw an error
        throw new ApiError(401, "Please login to access this resource");
    } catch (error) {
        throw new ApiError(401, error.message || "Please login to access this resource");
    }
};

// Admin-specific authentication middleware
const isAdminAuthenticated = async (req, res, next) => {
    try {
        const adminToken = req.cookies.adminToken;
        if (!adminToken) {
            throw new ApiError(401, "Please login as an admin to access this resource");
        }

        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "Admin") {
            throw new ApiError(401, "Admin not found or unauthorized");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Please login as an admin to access this resource");
    }
};

// Patient-specific authentication middleware
const isPatientAuthenticated = async (req, res, next) => {
    try {
        const patientToken = req.cookies.patientToken;
        if (!patientToken) {
            throw new ApiError(401, "Please login as a patient to access this resource");
        }

        const decoded = jwt.verify(patientToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "Patient not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Please login as a patient to access this resource");
    }
};

// Doctor-specific authentication middleware
const isDoctorAuthenticated = async (req, res, next) => {
    try {
        const doctorToken = req.cookies.doctorToken;
        if (!doctorToken) {
            throw new ApiError(401, "Please login as a doctor to access this resource");
        }

        const decoded = jwt.verify(doctorToken, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024");
        const doctor = await Doctor.findById(decoded.id);

        if (!doctor) {
            throw new ApiError(401, "Doctor not found");
        }

        req.user = doctor;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Please login as a doctor to access this resource");
    }
};

export {
    verifyJWT,
    isAuthenticated,
    isAdminAuthenticated,
    isPatientAuthenticated,
    isDoctorAuthenticated
};
