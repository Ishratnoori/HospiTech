import React, { useContext } from "react";
import { FaUserMd, FaLanguage, FaRupeeSign } from "react-icons/fa";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";

const DoctorsCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { isAuthe, user } = useContext(Context);

  const handleBookAppointment = (type) => {
    try {
      // Check if user is logged in
      if (!isAuthe) {
        toast.info("Please login to book an appointment");
        navigate("/login", { 
          state: { 
            from: `/appointment/${doctor._id}?type=${type}`,
            message: "Please login to book an appointment"
          } 
        });
        return;
      }

      // Check if user is a patient
      if (user?.role !== "Patient") {
        toast.error("Only patients can book appointments");
        return;
      }

      // Check if doctor ID exists
      if (!doctor?._id) {
        toast.error("Invalid doctor information");
        return;
      }

      // Navigate to appointment page with doctor ID and type
      const appointmentUrl = `/appointment/${doctor._id}?type=${type}`;
      console.log("Navigating to:", appointmentUrl); // Debug log
      navigate(appointmentUrl);
    } catch (error) {
      console.error("Error in handleBookAppointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  // Calculate cashback amount (5% of appointment charges)
  const calculateCashback = () => {
    try {
      const charges = parseInt(doctor.appointmentCharges);
      if (isNaN(charges)) {
        console.error("Invalid appointment charges:", doctor.appointmentCharges);
        return 0;
      }
      const cashback = Math.round(charges * 0.05);
      return cashback;
    } catch (error) {
      console.error("Error calculating cashback:", error);
      return 0;
    }
  };

  // Get department image
  const getDepartmentImage = () => {
    try {
      const department = doctor.department?.name?.toLowerCase();
      if (!department) {
        console.error("Invalid department:", doctor.department);
        return "/images/departments/default.jpg";
      }

      switch (department) {
        case "cardiology":
          return "/images/departments/cardiology.jpg";
        case "dermatology":
          return "/images/departments/dermatology.jpg";
        case "neurology":
          return "/images/departments/neurology.jpg";
        case "orthopedics":
          return "/images/departments/orthopedics.jpg";
        case "pediatrics":
          return "/images/departments/pediatrics.jpg";
        case "gynecology":
          return "/images/departments/gynecology.jpg";
        case "ophthalmology":
          return "/images/departments/ophthalmology.jpg";
        case "dentistry":
          return "/images/departments/dentistry.jpg";
        case "psychiatry":
          return "/images/departments/psychiatry.jpg";
        case "general medicine":
          return "/images/departments/general-medicine.jpg";
        default:
          return "/images/departments/default.jpg";
      }
    } catch (error) {
      console.error("Error getting department image:", error);
      return "/images/departments/default.jpg";
    }
  };

  return (
    <div className="p-6">
      {/* Doctor Image */}
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
        <img
          src={doctor.docAvatar || getDepartmentImage()}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getDepartmentImage();
          }}
        />
      </div>

      {/* Doctor Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-blue-600 font-medium">{doctor.department?.name}</p>
        </div>

        <div className="flex items-center text-gray-600">
          <FaUserMd className="mr-2" />
          <span>{doctor.experience} years EXP.</span>
        </div>

        <div className="text-gray-600">
          <p>{doctor.qualifications?.join(", ") || "No qualifications listed"}</p>
        </div>

        <div className="flex items-center text-gray-600">
          <FaRupeeSign className="mr-2" />
          <span>You pay</span>
        </div>
        <div className="text-xl font-semibold text-blue-600">
          Rs {doctor.appointmentCharges}
        </div>

        <div className="bg-blue-50 p-2 rounded-lg">
          <p className="text-blue-600 font-medium">HOSPITECH CASHBACK</p>
          <p className="text-green-600 font-semibold">Get Rs {calculateCashback()} cashback</p>
        </div>

        <div className="flex items-center text-gray-600">
          <FaLanguage className="mr-2" />
          <span>{doctor.languagesKnown?.join(", ") || "No languages listed"}</span>
        </div>

        {/* Appointment Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => handleBookAppointment("digital")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <BsFillCalendarCheckFill className="mr-2" />
            Book Digital Consult
          </button>
          <button
            onClick={() => handleBookAppointment("hospital")}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <BsFillCalendarCheckFill className="mr-2" />
            Book Hospital Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsCard; 