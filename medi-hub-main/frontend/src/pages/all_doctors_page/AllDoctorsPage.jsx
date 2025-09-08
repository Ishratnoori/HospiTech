import React, { useState, useEffect } from "react";
import DoctorsCard from "../../components/doctors_card/DoctorsCard";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AllDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/user/alldoctors", {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        console.log("Fetched doctors:", response.data.data); // Debug log
        setDoctors(response.data.data);
      } else {
        console.log("No doctors data in response:", response.data); // Debug log
        toast.error("No doctors found");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (error.response) {
        console.error("Error response:", error.response.data); // Debug log
        toast.error(error.response.data.message || "Failed to fetch doctors");
      } else if (error.request) {
        console.error("No response received:", error.request); // Debug log
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Failed to fetch doctors. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      fullName.includes(searchTerm.toLowerCase()) ||
      doctor.department.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === "" || doctor.department.name === specialty;
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(doctor => doctor.department.name))];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSpecialty(e.target.value);
  };

  const handleBookAppointment = (doctorId, type) => {
    navigate(`/appointment/${doctorId}?type=${type}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
          <p className="text-lg text-gray-600">Search and book appointments with our expert doctors</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Specialty Filter */}
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={specialty}
              onChange={handleSpecialtyChange}
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <DoctorsCard 
                  doctor={doctor} 
                  onBookAppointment={handleBookAppointment}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No doctors found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSpecialty("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllDoctorsPage;
