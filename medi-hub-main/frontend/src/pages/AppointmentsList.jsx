import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthe, user } = useContext(Context);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthe || !user) {
          toast.error("Please login to view appointments");
          navigate("/login", { state: { from: "/appointments" } });
          return;
        }

        // Check if user is a patient
        if (user.role !== "Patient") {
          toast.error("Only patients can view appointments");
          navigate("/dashboard");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/v1/appointment",
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.statusCode === 200) {
          setAppointments(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        if (error.response?.status === 401) {
          // Clear invalid auth data
          localStorage.removeItem("user");
          toast.error("Session expired. Please login again");
          navigate("/login", { state: { from: "/appointments" } });
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to view appointments");
          navigate("/dashboard");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch appointments");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthe, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Appointments</h1>
          <p className="text-lg text-gray-600">View and manage your appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No appointments found</p>
            <button
              onClick={() => navigate("/alldoctors")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </h2>
                    <p className="text-blue-600">{appointment.doctor?.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === "confirmed" ? "bg-green-100 text-green-800" :
                    appointment.status === "cancelled" ? "bg-red-100 text-red-800" :
                    appointment.status === "completed" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">
                      {new Date(appointment.appointmentDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{appointment.city}, {appointment.pincode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Charges</p>
                    <p className="font-medium">Rs {appointment.doctor?.appointmentCharges}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentsList; 