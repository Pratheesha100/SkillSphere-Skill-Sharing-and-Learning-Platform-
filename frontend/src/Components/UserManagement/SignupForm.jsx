import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

const SignupForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // State to track which field is focused

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      // Example minimum length
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    // Simulate API Call
    console.log("Simulating signup for:", name, email);
    setTimeout(() => {
      console.log("Signup simulation successful");
      setIsLoading(false);
      onSuccess(); // Call the success callback

      // Handle potential API errors (e.g., email already exists)
      // if (apiError) {
      //   setError('Could not create account. Email might already be in use.');
      //   setIsLoading(false);
      // }
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-sm space-y-5 font-roboto "
    >
      <h2 className="text-xl md:text-3xl font-bold  text-center text-[#111827] mb-6 ">Create Account</h2>

      {/* Full Name Input */}
      <div className={`relative ${focusedField === "name" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`} >
        <User
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-0focus:border-transparent transition-all 
          duration-300 ease-in-out"
          disabled={isLoading}
          aria-label="Full Name"/>
      </div>

      {/* Email Address Input */}
      <div
        className={`
          relative 
          ${focusedField === "email" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}
        `}
      >
        <Mail
          size={18}
          className="absolute left-3 top-1/2  transform -translate-y-1/2  text-gray-400 " />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          className=" w-full pl-10 pr-3 py-2  border border-gray-300 rounded-md  focus:outline-none focus:ring-0focus:border-transparent transition-all duration-300 ease-in-out "
          disabled={isLoading}
          aria-label="Email Address"/>
      </div>

      {/* Password Input */}
      <div
        className={`
          relative ${focusedField === "password" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`}
      >
        <Lock
          size={18}
          className="absolute left-3 top-1/2  transform -translate-y-1/2  text-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          className=" w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-0 focus:border-transparent transition-all duration-300 ease-in-out"
          disabled={isLoading}
          aria-label="Password"
        />
      </div>

      {/* Confirm Password Input */}
      <div
        className={`
           relative 
           ${focusedField === "confirmPassword" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}
         `}
       >
         <Lock
           size={18}
           className="absolute left-3 top-1/2  transform -translate-y-1/2 text-gray-400"/>
         <input
           type="password"
           placeholder="Confirm Password"
           value={confirmPassword}
           onChange={(e) => setConfirmPassword(e.target.value)}
           onFocus={() => setFocusedField("confirmPassword")}
           onBlur={() => setFocusedField(null)}
           className=" w-full pl-10 pr-3 py-2   border border-gray-300 rounded-md  focus:outline-none focus:ring-0focus:border-transparent transition-all duration-300 ease-in-out "
           disabled={isLoading}
           aria-label="Confirm Password"
         />
       </div>

       {error && (
         <p
           className="text-red-500 text-sm mt-1"
         >
           {error}
         </p>
       )}

       {/* Submit Button */}
       <motion.button
         type="submit"
         className=" w-full flex justify-center items-center py-2 px-4  bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out font-poppins "
         disabled={isLoading}
         whileHover={{ scale: 1.03 }}
         whileTap={{ scale: 0.98 }}
       >
         {isLoading ? (
           <div className="animate-spin rounded-full h-[20px] w-[20px] border-b-[2px] border-white mr-[8px]"></div>
         ) : (
           <UserPlus size={20} className="mr-[8px]" />
         )}
         {isLoading ? "Creating Account..." : "Sign Up"}
       </motion.button>
     </form>
   );
 };

 export default SignupForm;
