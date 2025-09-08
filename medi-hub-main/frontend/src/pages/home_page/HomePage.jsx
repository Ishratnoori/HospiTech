import React from "react";
import { Hero, WhyUs, Testimonials } from "../../import-export/ImportExport";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <>
      <Hero />
      <div className="w-full bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NavLink
              to="/doctors"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Book Your Appointment Now</h3>
              <p className="text-gray-600">Book appointments with our expert doctors</p>
            </NavLink>
            <NavLink
              to="/medicines"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Buy Medicines and Essentials</h3>
              <p className="text-gray-600">Get your medicines delivered to your doorstep</p>
            </NavLink>
            <NavLink
              to="/specialities"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Browse Specialties</h3>
              <p className="text-gray-600">Explore our range of medical specialties</p>
            </NavLink>
          </div>
        </div>
      </div>
      <WhyUs />
      {/* <TopSpecialities /> */}
      <Testimonials />
      {/* <Contributors /> */}
    </>
  );
}

export default Home;
