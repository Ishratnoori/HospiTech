import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js"
import { generateToken } from "../utilis/jwtToken.js";


//! Login the user
export const login = asyncHandler(async (req, res, next) => {
    // taking the info from the user
    const { email, password, role } = req.body;

    console.log("Login attempt for:", { email, role }); // Log login attempt

    // checking the info provided by the user
    if (!email || !password || !role) {
        throw new ApiError(400, "Please provide email, password and role");
    }

    // find the user in database via email 
    let user;
    if (role === "Patient" || role === "Admin") {
        // Find user in user collection with password field
        user = await User.findOne({ email, role }).select("+password");
        console.log("Found user:", user ? "Yes" : "No"); // Log if user was found
    } else if (role === "Doctor") {
        // Find doctor in doctor collection
        user = await Doctor.findOne({ email }).select("+password");
        console.log("Found doctor:", user ? "Yes" : "No"); // Log if doctor was found
    } else {
        throw new ApiError(400, "Invalid role specified");
    }

    // Check if user or doctor exists
    if (!user) {
        throw new ApiError(404, `User with ${role} role not found`);
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    console.log("Password match:", isPasswordMatched); // Log password match result

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate token and send response
    generateToken(user, "User Logged In Successfully", 200, res);
})


//! Logout Admin
export const logoutAdmin = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "Admin logged out Successfully"
        });
})


//! Logout Patient
export const logoutPatient = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})


//! Logout Doctor
export const logoutDoctor = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("doctorToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})