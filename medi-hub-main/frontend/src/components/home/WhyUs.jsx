import React from "react";

function WhyUs() {
  return (
    <div className="w-full md:py-2 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center h-full lg:px-6 lg:py-8 lg:justify-center px-0 py-3">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-theme text-center">
          Why Choose Us
        </h1>
        <p className="text-xs md:text-base md:max-w-2xl mt-6 text-center">
          We understand that your health and well-being are of paramount
          importance. Here are compelling reasons why you should choose us for
          your healthcare needs
        </p>

        {/* cards */}
        <div className="grid grid-cols-1 lg:grid-rows-1 lg:grid-cols-3 gap-x-8 gap-y-4 md:gap-y-10 lg:py-8 mt-12 md:mt-14 lg:mt-20 px-3">
          {/* Advanced Technology card */}
          <div className="flex flex-col items-start shadow-md my-4 rounded-lg md:px-4 hover:shadow-xl hover:border border-theme py-4 bg-pastel_blue">
            <div className="flex flex-col justify-between items-start gap-y-4 px-3 md:px-0">
              <div className="icon">
                <img 
                  src="/heart.png" 
                  alt="Advanced Technology" 
                  className="size-20 object-cover rounded-full border-2 border-red-600 p-2"
                />
              </div>

              <div className="text">
                <h1 className="mb-2 text-md text-left font-semibold uppercase text-theme/80">
                  Advanced Technology
                </h1>
                <p className="mt-0 text-sm text-left text-black">
                  State-of-the-art medical equipment and cutting-edge technology to ensure accurate diagnoses and effective treatments for our patients.
                </p>
              </div>
            </div>
          </div>

          {/* Certified Doctors card */}
          <div className="flex flex-col items-start shadow-md my-4 rounded-lg md:px-4 hover:shadow-xl hover:border border-theme py-4 bg-pastel_yellow">
            <div className="flex flex-col justify-between items-start gap-y-4 px-3 md:px-0">
              <div className="icon">
                <img 
                  src="/new_hero.png" 
                  alt="Certified Doctors" 
                  className="size-20 object-cover rounded-full border-2 border-green-600 p-2"
                />
              </div>

              <div className="text">
                <h1 className="mb-2 text-md text-left font-semibold uppercase text-theme/80">
                  Certified Doctors
                </h1>
                <p className="mt-0 text-sm text-left text-black">
                  Our team consists of highly qualified and experienced medical professionals dedicated to providing the best healthcare services.
                </p>
              </div>
            </div>
          </div>

          {/* Infrastructure card */}
          <div className="flex flex-col items-start shadow-md my-4 rounded-lg md:px-4 hover:shadow-xl hover:border border-theme py-4 bg-pastel_pink">
            <div className="flex flex-col justify-between items-start gap-y-4 px-3 md:px-0">
              <div className="icon">
                <img 
                  src="/Image.png" 
                  alt="Best Infrastructure" 
                  className="size-20 object-cover rounded-full border-2 border-gray-900 p-2"
                />
              </div>

              <div className="text">
                <h1 className="mb-2 text-md text-left font-semibold uppercase text-theme/80">
                  Best Infrastructure
                </h1>
                <p className="mt-0 text-sm text-left text-black">
                  Modern facilities and comfortable environment designed to provide the best possible care and experience for our patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyUs;
