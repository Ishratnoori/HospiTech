import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaRegCalendarCheck,
  FaRegHeart,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import { Context } from "../Context/Context";
import toast from "react-hot-toast";

function Navbar() {
  const { isAuthe, user, setIsAuthe, setUser, handleLogout } = useContext(Context);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthe(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // state to manage drop down menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav items
  const navItems = [
    { to: "/doctors", label: "All Doctors" },
    { to: "/specialities", label: "Specialities" },
    { to: "/medicines", label: "Medicines" },
  ];

  // Add appointments link if user is logged in
  if (isAuthe && user?.role === "Patient") {
    navItems.push({ to: "/appointments", label: "Appointments" });
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold relative cursor-pointer before:block before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-0.5 before:rounded-full before:bg-text before:transition-all before:delay-150 before:ease-in-out hover:before:w-full hover:text-dark_theme ${
      isActive ? "text-dark_theme" : "text-main_theme"
    } `;

  // mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Dropdown menus
  const dropdownMenus = [
    { to: "/profile", label: "My Profile", icon: FaRegCircleUser },
    { to: "/appointments", label: "Appointments", icon: FaRegCalendarCheck },
    { to: "/medicines/wishlist", label: "Wishlist", icon: FaRegHeart },
    { to: "/medicines/order_history", label: "Orders", icon: LuBox },
    { to: "#", label: "Logout", icon: FaSignOutAlt, onClick: handleLogout },
  ];

  // mouse events on drop down menu
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="w-full h-[8vh] sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-4 h-full">
        {/* logo */}
        <NavLink to="/">
          <h1 className="text-3xl text-dark_theme tracking-wide font-bold">
            HospiTech
          </h1>
        </NavLink>

        {/* Nav Menus */}
        <div className="hidden lg:flex items-center justify-between gap-8">
          <ul className="flex gap-8 items-center">
            {navItems.map((navItem, index) => (
              <li key={index}>
                <NavLink to={navItem.to} className={navLinkClass}>
                  {navItem.label}
                </NavLink>
              </li>
            ))}
            <li
              className="relative hover:scale-105"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isAuthe ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.firstName || "User"}!
                  </span>
                  <NavLink
                    to="/profile"
                    className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2 max-w-[150px]"
                  >
                    <FaRegCircleUser className="text-dark_theme" />
                    <span className="truncate">My Account</span>
                  </NavLink>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/register"
                    className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                  >
                    <span className="truncate">Sign Up</span>
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                  >
                    <FaSignInAlt className="text-dark_theme" />
                    <span className="truncate">Login</span>
                  </NavLink>
                </div>
              )}

              {/* Dropdown Menus */}
              {isDropdownOpen && isAuthe && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-light_theme border border-dark_theme rounded shadow-lg z-50"
                  onMouseEnter={handleMouseEnter}
                >
                  {/* Drop down menu items */}
                  {dropdownMenus.map((menu, index) => (
                    <NavLink
                      key={index}
                      to={menu.to}
                      className="flex items-center px-4 py-3 gap-2 text-sm font-medium text-dark_theme hover:bg-main_theme/10"
                      onClick={menu.onClick}
                    >
                      {menu.icon && (
                        <menu.icon className="text-dark_theme size-4" />
                      )}
                      {menu.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Menu Toggle button */}
        <div className="lg:hidden inline-flex">
          <button onClick={toggleMobileMenu} className="text-dark_theme">
            {isMobileMenuOpen ? (
              <FaTimes
                size={26}
                className="rounded-sm border border-dark_theme bg-light_theme"
              />
            ) : (
              <FaBars size={26} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMobileMenu}
          ></div>
          <div className="lg:hidden bg-gray-200 w-2/3 md:w-3/5 min-h-screen absolute right-0 z-50 px-4 py-4">
            {isAuthe && (
              <div className="px-4 py-3 mb-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-semibold text-dark_theme">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            )}
            <ul className="w-full flex flex-col items-start px-4 py-4">
              {navItems.map((navItem, index) => (
                <li key={index} className="mb-4">
                  <NavLink
                    to={navItem.to}
                    className={navLinkClass}
                    onClick={toggleMobileMenu}
                  >
                    {navItem.label}
                  </NavLink>
                </li>
              ))}
              <li className="relative mb-4">
                {isAuthe ? (
                  <NavLink
                    to="/profile"
                    className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                    onClick={toggleMobileMenu}
                  >
                    <FaRegCircleUser className="text-dark_theme" />
                    <span className="truncate">My Account</span>
                  </NavLink>
                ) : (
                  <div className="flex flex-col gap-4">
                    <NavLink
                      to="/register"
                      className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                      onClick={toggleMobileMenu}
                    >
                      <span className="truncate">Sign Up</span>
                    </NavLink>
                    <NavLink
                      to="/login"
                      className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                      onClick={toggleMobileMenu}
                    >
                      <FaSignInAlt className="text-dark_theme" />
                      <span className="truncate">Login</span>
                    </NavLink>
                  </div>
                )}

                {/* Dropdown Menus */}
                {isDropdownOpen && isAuthe && (
                  <div className="w-full bg-light_theme border border-dark_theme rounded shadow-lg z-50 mt-2">
                    {dropdownMenus.map((menu, index) => (
                      <NavLink
                        key={index}
                        to={menu.to}
                        className="flex items-center px-4 py-3 gap-2 text-sm font-medium text-dark_theme hover:bg-main_theme/10"
                        onClick={(e) => {
                          if (menu.onClick) {
                            e.preventDefault();
                            menu.onClick();
                          }
                          toggleMobileMenu();
                        }}
                      >
                        {menu.icon && (
                          <menu.icon className="text-dark_theme size-4" />
                        )}
                        {menu.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
