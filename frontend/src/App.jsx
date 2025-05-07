import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      {/*User routes*/}
      <Route path="/" element={<SimulateLogin />} />
      <Route path="/home" element={<Home />} />

      {/*skillsharing routes*/}

      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/*UserManagement routes*/}

      {/*Group routes*/}
      <Route path="/groups" element={<GroupView />} />
      <Route path="/groups/:userId" element={<GroupView />} />
      <Route path="/create-group" element={<GroupCreating />} />
      <Route path="/create-group/:userId" element={<GroupCreating />} />
      <Route path="/groups/:groupId/:userId" element={<GroupChat />} />
      <Route path="/update-group/:groupId/:userId" element={<GroupUpdate />} />
      <Route path="/groups/:groupId/add-members/:userId" element={<AddMember />} />

      {/*Game routes*/}
    </Routes>
  );
}

export default App
