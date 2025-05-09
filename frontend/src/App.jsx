import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import Profile from './Components/UserManagement/Profile.jsx';
import TaskCorner from './Components/SkillSharing/TaskCorner.jsx';
import Posts from './Components/SkillSharing/Posts.jsx';
import Layout from "./Components/Navigation/Layout.jsx";
import PostsView from "./Components/SkillSharing/PostsView.jsx";
import GroupView from './Components/GroupManagement/GroupView.jsx';
import GroupChat from './Components/GroupManagement/GroupChat.jsx';


function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      {/* User Management Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />

      {/* Skill Sharing Routes */}
      <Route path="/TaskCorner" element={<Layout><TaskCorner /></Layout>} />
      <Route path="/posts" element={<Layout><Posts /></Layout>} />
      <Route path="/postview" element={<Layout><PostsView /></Layout>} />

      {/* Interactivity Routes */}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/* Group Management Routes */}
      <Route path="/groups" element={<Layout><GroupView /></Layout>} />
      <Route path="/groups/:groupId/chat" element={<Layout><GroupChat /></Layout>} />
    
     

      {/* Game routes - Add here as needed */}
    </Routes>
  );
}

export default App;
