import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../Context/Context";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthe, user } = useContext(Context);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response?.status === 404) {
        toast.error("Appointments endpoint not found. Please check the API URL.");
      } else if (error.response?.status === 401) {
        toast.error("Please login to view appointments");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch appointments");
      }
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthe || !user) {
      toast.error("Please login to view appointments");
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [isAuthe, user, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      case "completed":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/appointment/${appointmentId}`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Appointment cancelled successfully");
        // Refresh the appointments list
        await fetchAppointments();
      } else {
        toast.error(response.data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      if (error.response?.status === 404) {
        toast.error("Appointment not found or you don't have permission to cancel this appointment");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Only pending appointments can be cancelled");
      } else if (error.response?.status === 401) {
        toast.error("Please login to cancel appointments");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to cancel appointment");
      }
    }
  };

  const handlePayment = async (appointment) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/payment/create`,
        {
          appointmentId: appointment._id,
          amount: appointment.amount,
          doctorId: appointment.doctor._id,
          appointmentType: appointment.appointmentType
        },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.statusCode === 200) {
        // Navigate to payment page
        navigate(`/payment/${response.data.data.orderId}`);
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  };

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
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <button
              onClick={() => navigate("/doctors")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Book New Appointment
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No appointments found</p>
              <button
                onClick={() => navigate("/doctors")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doctor?.firstName || 'N/A'} {appointment.doctor?.lastName || ''}
                      </h3>
                      <p className="text-blue-600">{appointment.doctor?.department?.name || 'Department not specified'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString() : 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {appointment.appointmentType === "digital" ? "Digital Consult" : "Hospital Visit"}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {appointment.city || 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> Rs {appointment.amount || '0'}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      <span className={getStatusColor(appointment.paymentStatus)}>
                        {appointment.paymentStatus || 'Pending'}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {appointment.paymentStatus === 'pending' && (
                      <button
                        onClick={() => handlePayment(appointment)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Pay Now
                      </button>
                    )}
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments; 