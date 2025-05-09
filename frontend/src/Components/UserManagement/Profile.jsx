import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const ProfileUpdate = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    birthday: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        const userData = response.data;
        setFormData({
          name: userData.name || "",
          occupation: userData.occupation || "",
          birthday: userData.birthday ? userData.birthday.split('T')[0] : ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        showErrorAlert("Error", "Failed to load user data");
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    const errors = {};
    
    if (formData.name && formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (formData.birthday) {
      const today = new Date();
      const birthday = new Date(formData.birthday);
      if (birthday > today) {
        errors.birthday = "Birthday cannot be in the future";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      customClass: {
        popup: "font-poppins",
        title: "text-lg",
        confirmButton: "text-sm"
      }
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Your profile has been updated successfully.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      customClass: {
        popup: "font-poppins",
        title: "text-lg",
        confirmButton: "text-sm"
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for the field being edited
    setValidationErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorMessages = Object.values(validationErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        showErrorAlert("Validation Error", errorMessages.join("\n"));
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}/profile`,
        formData
      );

      if (response.status === 200) {
        showSuccessAlert();
      }
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "An error occurred while updating your profile";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid input data";
        }
      }
      
      showErrorAlert("Update Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 font-roboto">
      <h2 className="text-xl md:text-3xl font-bold text-center text-[#111827] mb-6">Update Profile</h2>

      {/* Name Input */}
      <div className="space-y-1">
        <div className={`relative ${focusedField === "name" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`}>
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out font-poppins"
            disabled={isLoading}
          />
        </div>
        {validationErrors.name && (
          <p className="text-red-500 text-xs flex items-center">
            <AlertCircle size={12} className="mr-1" />
            {validationErrors.name}
          </p>
        )}
      </div>

      {/* Occupation Input */}
      <div className="space-y-1">
        <div className={`relative ${focusedField === "occupation" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`}>
          <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            onFocus={() => setFocusedField("occupation")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out font-poppins"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Birthday Input */}
      <div className="space-y-1">
        <div className={`relative ${focusedField === "birthday" ? "shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-gray-300 rounded-md" : ""}`}>
          <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            onFocus={() => setFocusedField("birthday")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out font-poppins"
            disabled={isLoading}
          />
        </div>
        {validationErrors.birthday && (
          <p className="text-red-500 text-xs flex items-center">
            <AlertCircle size={12} className="mr-1" />
            {validationErrors.birthday}
          </p>
        )}
      </div>

      {/* Update Button */}
      <motion.button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out font-poppins"
        disabled={isLoading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-[20px] w-[20px] border-b-[2px] border-white mr-[8px]"></div>
        ) : (
          <User size={20} className="mr-[8px]"/>
        )}
        {isLoading ? "Updating..." : "Update Profile"}
      </motion.button>
    </form>
  );
};

export default ProfileUpdate; 