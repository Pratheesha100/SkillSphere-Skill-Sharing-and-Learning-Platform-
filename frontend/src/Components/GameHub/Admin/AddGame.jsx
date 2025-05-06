import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddGame = () => {
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Game Name:', gameName);
    console.log('Game Description:', gameDescription);
    // Add logic to send data to the backend
  };

  return (
    <div>
      <h1>Add New Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Game Name:</label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Game Description:</label>
          <textarea
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Game</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <h2>Other Game Options</h2>
        <button onClick={() => navigate('/admin/add-mcq-set')}>Add MCQ Set</button>
        <button onClick={() => navigate('/admin/add-memory-match-game')} style={{ marginLeft: '10px' }}>
          Add Memory Match Game
        </button>
      </div>
    </div>
  );
};

export default AddGame;