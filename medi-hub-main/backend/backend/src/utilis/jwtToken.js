import jwt from "jsonwebtoken";
import { ApiResponse } from "../utilis/ApiResponse.js";

export const generateToken = (user, message, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY || "medihub_secret_key_2024", {
        expiresIn: "30d",
    });

    // Determine the cookie name based on the user's role
    let cookieName;
    if (user.role === "Admin") {
        cookieName = "adminToken";
    } else if (user.role === "Patient") {
        cookieName = "patientToken";
    } else if (user.role === "Doctor") {
        cookieName = "doctorToken";
    }

    // const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

    res
        .status(statusCode)
        .cookie(cookieName, token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: "strict",
        })
        .json(new ApiResponse(statusCode, {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token,
        }, message));
};