import mongoose from "mongoose";
import { Doctor } from "../models/doctor.model.js";
import dotenv from "dotenv";

dotenv.config();

const sampleDoctors = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@hospitech.com",
    phone: "9876543210",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Mumbai",
      pincode: "400001"
    },
    gender: "Male",
    department: {
      name: "Cardiology",
      description: "Heart and cardiovascular system"
    },
    specializations: [{
      name: "Interventional Cardiology",
      description: "Specialized in heart procedures"
    }],
    qualifications: ["MBBS", "MD", "DM Cardiology"],
    experience: "15 years",
    availabelSlots: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "9:00 AM - 5:00 PM"
    },
    docAvatar: "/new_hero.png",
    role: "Doctor",
    languagesKnown: ["English", "Hindi", "Marathi"],
    appointmentCharges: "1500"
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospitech.com",
    phone: "9876543211",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Delhi",
      pincode: "110001"
    },
    gender: "Female",
    department: {
      name: "Dermatology",
      description: "Skin and hair treatments"
    },
    specializations: [{
      name: "Cosmetic Dermatology",
      description: "Specialized in cosmetic procedures"
    }],
    qualifications: ["MBBS", "MD", "DDVL"],
    experience: "10 years",
    availabelSlots: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "10:00 AM - 6:00 PM"
    },
    docAvatar: "/new_hero.png",
    role: "Doctor",
    languagesKnown: ["English", "Hindi"],
    appointmentCharges: "2000"
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@hospitech.com",
    phone: "9876543212",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Bangalore",
      pincode: "560001"
    },
    gender: "Male",
    department: {
      name: "Neurology",
      description: "Brain and nervous system"
    },
    specializations: [{
      name: "Neuro Surgery",
      description: "Specialized in brain surgery"
    }],
    qualifications: ["MBBS", "MS", "MCh Neurosurgery"],
    experience: "20 years",
    availabelSlots: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "9:00 AM - 4:00 PM"
    },
    docAvatar: "/new_hero.png",
    role: "Doctor",
    languagesKnown: ["English", "Hindi", "Kannada"],
    appointmentCharges: "3000"
  }
];

const addDoctors = async () => {
  try {
    // Connect to MongoDB with explicit database name
    await mongoose.connect("mongodb://localhost:27017/MediHub", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Check if doctors collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const doctorCollectionExists = collections.some(col => col.name === 'doctors');
    console.log("Doctor collection exists:", doctorCollectionExists);

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    // Add new doctors
    const doctors = await Doctor.insertMany(sampleDoctors);
    console.log("Added sample doctors:", doctors);

    // Verify doctors were added
    const count = await Doctor.countDocuments();
    console.log("Total doctors in database:", count);

    console.log("Script completed successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

addDoctors(); 