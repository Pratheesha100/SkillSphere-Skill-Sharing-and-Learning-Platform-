import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import ProfileUpdate from './Components/UserManagement/ProfileUpdate.jsx';
import TaskCorner from './Components/SkillSharing/TaskCorner.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      
      {/*User routes*/}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<ProfileUpdate />} />

      {/*skillsharing routes*/}
      <Route path="/Task-Corner" element={<TaskCorner />} />


      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/*UserManagement routes*/}



      {/*Group routes*/}





      {/*Game routes*/}





    </Routes>
  );
}

export default App
