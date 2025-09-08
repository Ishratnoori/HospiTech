import React from "react";
import { NavLink } from "react-router-dom";

function Specialties() {
  const specialties = [
    {
      id: 1,
      name: "Cardiology",
      image: "/heart.png",
      description: "For heart and blood pressure problems",
      conditions: ["Chest pain", "Heart Failure", "Cholesterol"],
    },
    {
      id: 2,
      name: "Dermatology",
      image: "/dermatology.jpg",
      description: "Specialists for skin and hair treatments",
      conditions: ["Rashes", "Pimples", "Acne", "Hairfall", "Dandruff"],
    },
    {
      id: 3,
      name: "ENT",
      image: "/ent.jpg",
      description: "ENT specialists for Ear, Nose and Throat",
      conditions: ["Earache", "Bad breath", "Swollen neck", "Vertigo"],
    },
    {
      id: 4,
      name: "General Physician/Internal Medicine",
      image: "/general-physician.jpg",
      description: "Managing acute medical conditions",
      conditions: ["Typhoid", "Abdominal Pain", "Migraine", "Infections"],
    },
    {
      id: 5,
      name: "Neurology",
      image: "/neurology.jpg",
      description: "Managing issues of the nervous system, brain",
      conditions: ["Stroke", "Dementia", "Epilepsy", "Movement issues"],
    },
    {
      id: 6,
      name: "Obstetrics & Gynaecology",
      image: "/gynecology.jpg",
      description: "For women health issues and surgeries",
      conditions: ["Irregular periods", "Pregnancy", "PCOD/PCOS"],
    },
    {
      id: 7,
      name: "Orthopaedics",
      image: "/orthopedics.jpg",
      description: "Managing issues of bones, joints, knees",
      conditions: ["Knee Pain", "Shoulder Pain", "Bone deformity"],
    },
    {
      id: 8,
      name: "Paediatrics",
      image: "/pediatrics.jpg",
      description: "Specialists to care and treat children",
      conditions: ["Constipation", "Puberty", "Nutrition", "Autism"],
    },
  ];

  const handleImageError = (e, specialtyName) => {
    console.error(`Failed to load image for ${specialtyName}:`, e.target.src);
    e.target.onerror = null;
    e.target.src = "/new_hero.png";
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            Browse Specialties
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Find the right specialist for your health concerns. Our doctors are
            experts in their respective fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {specialties.map((specialty) => (
            <NavLink
              key={specialty.id}
              to={`/specialities/${specialty.name.toLowerCase()}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="w-full h-48 mb-6 rounded-lg overflow-hidden bg-[#f8fafc] flex items-center justify-center">
                  <img
                    src={specialty.image}
                    alt={specialty.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => handleImageError(e, specialty.name)}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                  {specialty.name}
                </h3>
                <p className="text-[#64748b] mb-4 text-sm leading-relaxed">
                  {specialty.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {specialty.conditions.map((condition, index) => (
                    <span
                      key={index}
                      className="bg-[#f1f5f9] text-[#0f172a] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Specialties; 