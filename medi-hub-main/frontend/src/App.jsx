import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/home_page/HomePage";
import LoginPage from "./pages/login_signup_page/LoginPage";
import SignupPage from "./pages/login_signup_page/SignupPage";
import AllDoctorsPage from "./pages/all_doctors_page/AllDoctorsPage";
import SpecialitiesPage from "./pages/top_specialities_page/SpecialitiesPage";
import MedicinesPage from "./pages/medicines_page/MedicinesPage";
import Appointments from "./pages/Appointments";
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/error_page/ErrorPage";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/doctors" element={<AllDoctorsPage />} />
            <Route path="/specialities" element={<SpecialitiesPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointment/:doctorId" element={<Appointment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
