import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/UserManagement/AuthPage';
import Signup from './Components/UserManagement/SignupForm';
import Home from './Components/UserManagement/Home';
import GroupView from './Components/GroupManagement/GroupView';
import GroupCreating from './Components/GroupManagement/GroupCreating';
import GroupChat from './Components/GroupManagement/GroupChat';

import AddUserGroup from './Components/GroupManagement/AddUserGroup';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path="/home" element={<Home />} />

      {/* Group Management Routes */}
      <Route path="/groups" element={<GroupView />} />
    
      <Route path="/create-group" element={<GroupCreating />} />
      <Route path="/groups/:groupId/add-member" element={<AddUserGroup />} />
      <Route path="/groups/:groupId/chat" element={<GroupChat />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
