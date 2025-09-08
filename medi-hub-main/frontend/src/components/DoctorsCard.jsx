import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import { FaRegCalendarCheck } from "react-icons/fa";
import { toast } from "react-toastify";

function DoctorsCard({ doctor }) {
  const { isAuthe, user } = useContext(Context);
  const navigate = useNavigate();

  const handleBooking = (type) => {
    if (!isAuthe) {
      toast.info("Please login to book an appointment");
      navigate("/login", { state: { from: `/appointment/${doctor._id}?type=${type}` } });
      return;
    }

    if (user?.role !== "Patient") {
      toast.error("Only patients can book appointments");
      return;
    }

    navigate(`/appointment/${doctor._id}?type=${type}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-blue-600">{doctor.department}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Experience</p>
            <p className="font-medium">{doctor.experience} years</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-gray-600">
            <span className="font-medium">Education:</span> {doctor.education}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {doctor.city}, {doctor.pincode}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Charges:</span> Rs {doctor.consultationFee}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleBooking("digital")}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            <FaRegCalendarCheck />
            Book Digital Consult
          </button>
          <button
            onClick={() => handleBooking("hospital")}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            <FaRegCalendarCheck />
            Book Hospital Visit
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorsCard; 