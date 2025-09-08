import express from "express";
import {
  patientRegister,
  getUserDetails,
  getDoctorDetails
} from "../controllers/user.controller.js";

import {
  login,
  logoutAdmin,
  logoutDoctor,
  logoutPatient
} from "../controllers/login_logout.controller.js";

import { addNewAdmin } from "../controllers/admin.controller.js";
import {
  addNewDoctor,
  getAllDoctors,
  getDoctorById
} from "../controllers/doctor.controller.js";

import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated
} from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route is active");
});

router.post("/patient/register", patientRegister);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

router.post("/doctor/addnew", isAdminAuthenticated, upload.single("docAvatar"), addNewDoctor);
router.get("/doctor/me", isDoctorAuthenticated, getDoctorDetails);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.get("/doctor/:id", getDoctorById);

router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

router.post("/login", login);
router.get("/alldoctors", getAllDoctors);

router.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", message: "User API is live" });
});

export default router;
