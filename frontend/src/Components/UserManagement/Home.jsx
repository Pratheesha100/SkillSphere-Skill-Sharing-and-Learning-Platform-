import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Home.css";

function Home() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If userId is in URL, use it, otherwise try to get from localStorage
    const storedUserId = userId || localStorage.getItem('userId');
    if (storedUserId) {
      // Fetch user details using the userId
      fetch(`http://localhost:8080/api/users/${storedUserId}`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user:', error));
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleGroupsClick = () => {
    const currentUserId = userId || localStorage.getItem('userId');
    navigate(`/groups/${currentUserId}`);
  };

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}!</h1>
      <div className="button-container">
        <button 
          onClick={handleGroupsClick}
          className="nav-button groups-button"
        >
          Groups
        </button>
        {/* Add other navigation buttons here */}
      </div>
    </div>
  );
}

export default Home;
