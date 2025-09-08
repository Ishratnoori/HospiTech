import React, { useEffect, useState } from "react";
// import { axios } from "../../import-export/ImportExport";
import { toast } from "react-toastify";
import axios from "axios";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([
    {
      fullName: "Parth Kumar",
      country: "India",
      state: "Delhi",
      review: "Loved the experience at HospiTech, best healthcare system that makes user life easier.",
      image: "/new_hero.png"
    },
    {
      fullName: "Sarah Johnson",
      country: "USA",
      state: "California",
      review: "The online appointment booking system is incredibly convenient. I can schedule my visits without any hassle.",
      image: "/new_hero.png"
    },
    {
      fullName: "Michael Chen",
      country: "Singapore",
      state: "Central",
      review: "The doctor search feature helped me find the right specialist quickly. Great platform!",
      image: "/new_hero.png"
    },
    {
      fullName: "Emma Wilson",
      country: "UK",
      state: "London",
      review: "The medicine delivery service is a lifesaver. Fast and reliable!",
      image: "/new_hero.png"
    }
  ]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [review, setReview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/testimonial/getall"
        );
        if (response.data.data && response.data.data.length > 0) {
          setTestimonials(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleFeedback = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    // Improved email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!country.trim()) {
      toast.error("Please enter your country");
      return;
    }
    if (!state.trim()) {
      toast.error("Please enter your state");
      return;
    }
    if (!review.trim()) {
      toast.error("Please enter your review");
      return;
    }
    if (review.trim().length < 5) {
      toast.error("Please write a more detailed review (minimum 5 characters)");
      return;
    }

    try {
      const formData = new FormData();
      
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("country", country.trim());
      formData.append("state", state.trim());
      formData.append("review", review.trim());

      // Use default avatar from public directory
      const defaultImageUrl = "/new_hero.png";
      const imageResponse = await fetch(defaultImageUrl);
      const blob = await imageResponse.blob();
      const imageFile = new File([blob], "default-avatar.jpg", { type: "image/jpeg" });
      formData.append("image", imageFile);

      const apiResponse = await axios.post(
        "http://localhost:8000/api/v1/testimonial/add",
        formData,
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
          },
        }
      );

      if (apiResponse.data) {
        toast.success(apiResponse.data.message || "Review submitted successfully!");
        setFullName("");
        setEmail("");
        setCountry("");
        setState("");
        setReview("");
        setShowForm(false);

        // Refresh testimonials list
        try {
          const testimonialsResponse = await axios.get(
            "http://localhost:8000/api/v1/testimonial/getall"
          );
          if (testimonialsResponse.data && testimonialsResponse.data.data) {
            setTestimonials(testimonialsResponse.data.data);
          }
        } catch (error) {
          console.error("Error refreshing testimonials:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Error submitting review. Please try again.";
      toast.error(errorMessage);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <main className="w-full bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe]">
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Join thousands of satisfied users who have experienced the HospiTech difference.
            Share your story and help others make informed healthcare decisions.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-[#e2e8f0]">
            <div className="flex flex-col items-center">
              <FaQuoteLeft className="text-4xl text-[#0284c7] mb-6" />
              <p className="text-xl text-[#334155] text-center mb-8">
                {testimonials[currentIndex]?.review}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0284c7]">
                  <img
                    src={testimonials[currentIndex]?.image}
                    alt={testimonials[currentIndex]?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f172a]">
                    {testimonials[currentIndex]?.fullName}
                  </h4>
                  <p className="text-[#64748b]">
                    {testimonials[currentIndex]?.country}, {testimonials[currentIndex]?.state}
                  </p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-[#f59e0b]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-lg hover:bg-[#f1f5f9] text-[#0284c7] hover:text-[#0369a1] transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-lg hover:bg-[#f1f5f9] text-[#0284c7] hover:text-[#0369a1] transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-[#0284c7]" : "bg-[#cbd5e1]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feedback Button */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#0284c7] text-white px-6 py-3 rounded-lg hover:bg-[#0369a1] transition-colors duration-200"
          >
            {showForm ? "Close Form" : "Share Your Experience"}
          </button>
        </div>

        {showForm && (
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleFeedback} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0284c7] focus:ring-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0284c7] focus:ring-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0284c7] focus:ring-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0284c7] focus:ring-[#0284c7]"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0284c7] focus:ring-[#0284c7]"
                  required
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#0284c7] text-white px-4 py-2 rounded-md hover:bg-[#0369a1] transition-colors duration-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default Testimonials;
