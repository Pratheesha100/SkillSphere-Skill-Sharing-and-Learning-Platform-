import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleGroupsClick = () => {
    navigate("/groups");
  };

  return (
    <div className="home-container">
      <button 
        onClick={handleGroupsClick}
        className="nav-button groups-button"
      >
        Go to Groups
      </button>
    </div>
  );
}

export default Home;
