import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/payment/${orderId}`,
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.statusCode === 200) {
          setPaymentDetails(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch payment details");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast.error(error.response?.data?.message || "Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const handlePayment = async () => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentDetails.amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "HospiTech",
        description: "Appointment Payment",
        order_id: paymentDetails.orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `http://localhost:8000/api/v1/payment/verify/${orderId}`,
              {
                status: "completed",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                withCredentials: true,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            );

            if (verifyResponse.data.statusCode === 200) {
              toast.success("Payment successful!");
              navigate("/appointments");
            } else {
              toast.error(verifyResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: paymentDetails?.appointment?.patient?.firstName + " " + paymentDetails?.appointment?.patient?.lastName,
          email: paymentDetails?.appointment?.patient?.email
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details Not Found</h2>
          <button
            onClick={() => navigate("/appointments")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Details</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Amount to Pay:</span>
              <span className="text-xl font-bold text-blue-600">Rs {paymentDetails.amount}</span>
            </div>
            
            <div className="space-y-2">
              <p><span className="font-medium">Doctor:</span> Dr. {paymentDetails.appointment?.doctor?.firstName} {paymentDetails.appointment?.doctor?.lastName}</p>
              <p><span className="font-medium">Appointment Type:</span> {paymentDetails.appointment?.appointmentType === "digital" ? "Digital Consult" : "Hospital Visit"}</p>
              <p><span className="font-medium">Date:</span> {new Date(paymentDetails.appointment?.appointmentDate).toLocaleString()}</p>
              <p><span className="font-medium">Location:</span> {paymentDetails.appointment?.city}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/appointments")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment; 