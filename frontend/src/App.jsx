import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import GameList from './Components/GameHub/User/GameList';

import AddGame from './Components/GameHub/Admin/AddGame';
import AddMemoryMatchGame from './Components/GameHub/Admin/AddMemoryMatchGame';
import EditGame from './Components/GameHub/Admin/EditGame';
import EditMemoryMatchGame from './Components/GameHub/Admin/EditMemoryMatchGame';
import AddMCQSet from './Components/GameHub/Admin/AddMCQSet';
import MCQList from './Components/GameHub/Admin/MCQList';
import MemoryMatchList from './Components/GameHub/Admin/MemoryMatchList';
import CategorySelection from './Components/GameHub/User/CategorySelection';
import DashboardActions from './Components/GameHub/User/DashboardActions';
import MemoryMatchGame from './Components/GameHub/User/MemoryMatchGame';
import MemoryMatchSummary from './Components/GameHub/User/MemoryMatchSummary';
import Quiz from './Components/GameHub/User/Quiz';
import QuizSummary from './Components/GameHub/User/QuizSummary';
import RecentGames from './Components/GameHub/User/RecentGames';
import Group from './Components/GroupManagement/Group';
import Skillshare from './Components/SkillSharing/skillshare';
import AuthImage from './Components/UserManagement/AuthImage';
import AuthNav from './Components/UserManagement/AuthNav';
import LoginForm from './Components/UserManagement/LoginForm';
import SignupForm from './Components/UserManagement/SignupForm';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      {/* User routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />

      {/* Interactivity routes */}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />

      {/* Game routes */}
      <Route path="/api/games" element={<GameList />} />
    
      <Route path="/api/games/add" element={<AddGame />} />
      <Route path="/api/games/memory-match/add" element={<AddMemoryMatchGame />} />
      <Route path="/api/games/edit/:id" element={<EditGame />} />
      <Route path="/api/games/memory-match/edit/:id" element={<EditMemoryMatchGame />} />

      {/* GameHub Admin routes */}
      <Route path="/admin/add-game" element={<AddGame />} />
      <Route path="/admin/add-mcq-set" element={<AddMCQSet />} />
      <Route path="/admin/add-memory-match-game" element={<AddMemoryMatchGame />} />
      <Route path="/admin/edit-game/:id" element={<EditGame />} />
      <Route path="/admin/mcq-list" element={<MCQList />} />
      <Route path="/admin/memory-match-list" element={<MemoryMatchList />} />

      {/* GameHub User routes */}
      <Route path="/user/category-selection" element={<CategorySelection />} />
      <Route path="/user/dashboard-actions" element={<DashboardActions />} />
      <Route path="/user/game-list" element={<GameList />} />
      <Route path="/user/memory-match-game" element={<MemoryMatchGame />} />
      <Route path="/user/memory-match-summary" element={<MemoryMatchSummary />} />
      <Route path="/user/quiz" element={<Quiz />} />
      <Route path="/user/quiz-summary" element={<QuizSummary />} />
      <Route path="/user/recent-games" element={<RecentGames />} />

      {/* GroupManagement routes */}
      <Route path="/group" element={<Group />} />

      {/* SkillSharing routes */}
      <Route path="/skillshare" element={<Skillshare />} />

      {/* UserManagement routes */}
      <Route path="/auth-image" element={<AuthImage />} />
      <Route path="/auth-nav" element={<AuthNav />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;
