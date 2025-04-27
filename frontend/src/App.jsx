import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import GameList from './Components/GameHub/GameList';
import AddGame from './Components/GameHub/AddGame';
import EditGame from './Components/GameHub/EditGame';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      
      {/*User routes*/}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />

      {/*skillsharing routes*/}



      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/*UserManagement routes*/}



      {/*Group routes*/}





      {/*Game routes*/}

      <Route path="/gamehub" element={<GameList />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/edit-game/:id" element={<EditGame />} />



    </Routes>
  );
}

export default App
