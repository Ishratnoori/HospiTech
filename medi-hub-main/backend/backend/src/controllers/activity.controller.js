import Activity from '../models/activity.model.js';
import asyncHandler from '../utilis/asyncHandler.js';
import { ApiError } from '../utilis/ApiError.js';

// Get user's recent activity
export const getUserActivity = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        
        const activities = await Activity.find({ user: userId })
            .sort({ timestamp: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Error in getUserActivity:', error);
        throw new ApiError(500, "Failed to fetch user activity");
    }
});

// Create new activity
export const createActivity = asyncHandler(async (req, res) => {
    try {
        const { type, description } = req.body;
        const userId = req.user._id;

        if (!type || !description) {
            throw new ApiError(400, "Type and description are required");
        }

        const activity = await Activity.create({
            user: userId,
            type,
            description,
            timestamp: new Date()
        });

        return res.status(201).json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Error in createActivity:', error);
        throw new ApiError(500, "Failed to create activity");
    }
}); 