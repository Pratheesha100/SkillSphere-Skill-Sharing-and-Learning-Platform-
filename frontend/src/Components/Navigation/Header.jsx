import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "About Us", path: "/about" },
  { name: "Posts", path: "/posts" },
  { name: "Tasks Corner", path: "/TaskCorner" },
  { name: "GameHub", path: "" },
  { name: "Groups", path: "" },
  { name: "Leader Board", path: "" },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-3 rounded-b-lg">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
        <GraduationCap className="text-blue-600 w-7 h-7" />
        <span className="font-bold text-xl text-gray-800">Aspira</span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-8 items-center">
        {navLinks.map((link, idx) => (
          <motion.button
            key={link.name}
            onClick={() => navigate(link.path)}
            className={`relative font-medium transition-colors duration-200 ${
              isActive(link.path)
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-500"
            }`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            {link.name}
            {/* Active underline */}
            {isActive(link.path) && (
              <motion.span
                layoutId="header-underline"
                className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Right side: Notification, Log In, Sign Up */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full hover:bg-blue-50 transition"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-blue-600" />
          {/* Notification dot (optional) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </motion.button>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-1.5 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-4 py-1.5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Header;
