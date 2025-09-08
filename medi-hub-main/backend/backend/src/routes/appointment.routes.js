import express from "express";
import {
  bookAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getAllAppointments
} from "../controllers/appointment.controller.js";
import {
  isAuthenticated,
  isPatientAuthenticated
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes
router.get("/", isAuthenticated, getAllAppointments);
router.post("/book", isAuthenticated, bookAppointment);
router.put("/:id", isAuthenticated, updateAppointmentStatus);
router.delete("/:id", isAuthenticated, deleteAppointment);

export default router;

