import express from "express";
import {
  addNewTestimonial,
  getAllTestimonial
} from "../controllers/testimonial.controller.js";

const router = express.Router();

router.post("/add", addNewTestimonial);
router.get("/getall", getAllTestimonial);

export default router;

