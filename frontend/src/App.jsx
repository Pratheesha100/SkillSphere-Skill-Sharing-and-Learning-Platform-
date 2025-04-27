import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Components/UserManagement/login.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      {/*User routes*/}
      <Route path="/" element={<Login />} />

      {/*skillsharing routes*/}



      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/*UserManagement routes*/}



      {/*Group routes*/}





      {/*Game routes*/}





    </Routes>
  );
}

export default App
