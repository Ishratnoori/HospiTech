import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../Context/Context";

function Appointment() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthe, user } = useContext(Context);
  const appointmentType = searchParams.get("type");
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    city: "",
    pincode: "",
    appointmentDate: "",
    appointmentType: appointmentType || "digital"
  });

  // List of all specialties
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "General Medicine",
    "ENT",
    "Other"
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthe) {
      toast.info("Please login to book an appointment");
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    // Check if user is a patient
    if (user?.role !== "Patient") {
      toast.error("Only patients can book appointments");
      navigate("/dashboard");
      return;
    }

    // Check if appointment type is valid
    if (!appointmentType || !["digital", "hospital"].includes(appointmentType)) {
      toast.error("Invalid appointment type");
      navigate("/doctors");
      return;
    }

    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/v1/user/doctor/${doctorId}`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.data.statusCode === 200) {
          setDoctor(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch doctor details");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        toast.error("Failed to fetch doctor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId, isAuthe, user, navigate, location, appointmentType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.city || !formData.pincode || !formData.appointmentDate) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Format the appointment date to ISO string
    const appointmentDateTime = new Date(formData.appointmentDate);
    if (isNaN(appointmentDateTime.getTime())) {
      toast.error("Invalid appointment date");
      setLoading(false);
      return;
    }

    // Log the request data for debugging
    const requestData = {
      doctorId: doctor._id,
      city: formData.city,
      pincode: formData.pincode,
      appointmentDate: appointmentDateTime.toISOString(),
      department: doctor.department.name,
      appointmentType: formData.appointmentType
    };
    console.log("Sending appointment request:", requestData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/appointment/book",
        requestData,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Appointment response:", response.data);

      if (response.data.statusCode === 201) {
        toast.success("Appointment booked successfully! Redirecting to appointments...");
        // Wait for 2 seconds to show the success message
        setTimeout(() => {
          navigate("/appointments");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || "Please check your input and try again";
        toast.error(errorMessage);
        console.error("Validation error:", errorMessage);
      } else if (error.response?.status === 401) {
        toast.error("Please login to book an appointment");
        navigate("/login");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add console log for doctor data
  useEffect(() => {
    if (doctor) {
      console.log("Doctor data:", doctor);
    }
  }, [doctor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Book {appointmentType === "digital" ? "Digital" : "Hospital"} Appointment
          </h1>

          {doctor && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="text-blue-600">{doctor.department.name}</p>
              <p className="text-gray-600">Experience: {doctor.experience} years</p>
              <p className="text-gray-600">Charges: Rs {doctor.appointmentCharges}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pincode"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                Appointment Date
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
