import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import SimulateLogin  from './Components/GroupManagement/Simulate-Login.jsx'
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import GroupView from './Components/GroupManagement/GroupView.jsx';
import GroupCreating from './Components/GroupManagement/GroupCreating.jsx';
import GroupChat from './Components/GroupManagement/GroupChat.jsx';
import GroupUpdate from './Components/GroupManagement/GroupUpdate.jsx';
import AddMember from './Components/GroupManagement/AddMember.jsx';

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
