import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import googleIcon from "../../assets/google.png"; // Correct import for Google icon
import facebookIcon from "../../assets/facebook.png"; // Correct import for Facebook icon

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // State to track which field is focused

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    // Basic Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    // Simulate API Call
    console.log("Simulating login for:", email);
    setTimeout(() => {
      console.log("Login simulation successful");
      setIsLoading(false);
      onSuccess(); // Call the success callback passed from AuthPage
    }, 1500); // Simulate network delay
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 font-roboto" >
      <h2 className="text-xl md:text-3xl font-bold text-center text-[#111827] mb-6">Welcome Back!</h2>
      {/* Email Input */}
      <div className={`relative ${focusedField === "email" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`} >
        <Mail
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out font-poppins"
          disabled={isLoading}
          aria-label="Email Address"/>
      </div>
      {error && (
        <p className=" text-red-500 text-sm mt-1 font-poppins ">{error}</p>
      )}

      {/* Password Input */}
      <div className={`relative  ${focusedField === "password" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`} >
        <Lock
          size={18}
          className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"} // Toggle between text and password types
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          className=" w-full pl-10 mb-2 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0  transition-all duration-300 ease-in-out font-poppins"
          disabled={isLoading}
          aria-label="Password"/>
        {/* Password Visibility Toggle */}
        <div onClick={() => setShowPassword(!showPassword)} 
             className=" absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-400 cursor-pointer  hover:text-blue-500 transition-colors duration-200 ease-in-out">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </div>
      </div>
       {error && (
        <p className=" text-red-500 text-sm mt-1 font-poppins ">{error}</p>
       )}

      {/* Login Button */}
      <motion.button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out font-poppins"
        disabled={isLoading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? ( <div className="animate-spin rounded-full h-[20px] w-[20px] border-b-[2px] border-white mr-[8px]"></div>) : (<LogIn size={20} className="mr-[8px]"/> )}
        {isLoading ? "Logging In..." : "Login"}
      </motion.button>

      {/* Forgot Password */}
      <div className="flex justify-between items-center text-sm mt-[16px]">
        <label className="flex items-center space-x-[8px]">
          <input type="checkbox" className="w-[16px] h-[16px] text-blue-[600px]" />
          <span className=" text-xs text-gray-600p font-poppins">Remember me</span>
        </label>
        <a href="#" className="text-xs text-[#EF476F] hover:text-blue-[500px] font-poppins">
          Forgot password?
        </a>
      </div>

      {/* Social Login Section */}
      <div className="mt-[24px]">
        <p className="text-center text-sm text-gray-[500px] mt-[10px] mb-[12px] font-poppins">Log in with</p>
        <div className="flex justify-center space-x-[16px]">
          {/* Google Icon */}
          <img src={googleIcon} alt="Google" className="
              w-[25px] h-[25px] cursor-pointer transition-transform duration-[300ms]
              ease-in-out hover:scale-[110%]
            " />

          {/* Facebook Icon */}
          <img src={facebookIcon} alt="Facebook" className="
              w-[25px] h-[25px] cursor-pointer transition-transform duration-[300ms]
              ease-in-out hover:scale-[110%]
            " />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
