import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import Profile from './Components/UserManagement/Profile.jsx';
import TaskCorner from './Components/SkillSharing/TaskCorner.jsx';
<<<<<<< HEAD
import Posts from './Components/SkillSharing/Posts.jsx';
import Layout from "./Components/Navigation/Layout.jsx";
import PostsView from "./Components/SkillSharing/PostsView.jsx";
import Notifications from './Components/Interactivity&Engagement/Notifications';
import Leaderboard from './Components/Interactivity&Engagement/Leaderboard';
import AboutUs from './Components/UserManagement/AboutUs';
import GroupView from './Components/GroupManagement/GroupView.jsx';
import GroupChat from './Components/GroupManagement/GroupChat.jsx';
import TaskView from './Components/SkillSharing/TaskView.jsx';
=======
import Posts from './Components/SkillSharing/Posts';
import Layout from "./Components/Navigation/Layout";
import PostsView from "./Components/SkillSharing/PostsView";
import DashboardActions from './Components/GameHub/User/DashboardActions.jsx';
import Quiz from './Components/GameHub/User/Quiz.jsx';
import QuizSummary from './Components/GameHub/User/QuizSummary.jsx';
import MemoryMatchGame from './Components/GameHub/User/MemoryMatchGame.jsx';
import MemoryMatchSummary from './Components/GameHub/User/MemoryMatchSummary.jsx';
import Progress from './Components/GameHub/User/Progress.jsx';
import GameList from './Components/GameHub/User/GameList.jsx';
import GameView from './Components/GameHub/User/GameView.jsx';
import CategorySelection from './Components/GameHub/User/CategorySelection.jsx';

// Admin Components
import AddGame from './Components/GameHub/Admin/AddGame.jsx';
import MCQList from './Components/GameHub/Admin/MCQList.jsx';
import MemoryMatchList from './Components/GameHub/Admin/MemoryMatchList.jsx';
import AddMCQSet from './Components/GameHub/Admin/AddMCQSet.jsx';
import EditMcqGame from './Components/GameHub/Admin/EditMcqGame.jsx';
import EditMemoryMatchGame from './Components/GameHub/Admin/EditMemoryMatchGame.jsx';
import AddMemoryMatchGame from './Components/GameHub/Admin/AddMemoryMatchGame.jsx';
>>>>>>> f4cd11f7e88c06bb877250219bf200d85541a01e

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      {/* User Management Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/about" element={<Layout><AboutUs /></Layout>} />

      {/* Skill Sharing Routes */}
      <Route path="/TaskCorner" element={<Layout><TaskCorner /></Layout>} />
      <Route path="/posts" element={<Layout><Posts /></Layout>} />
      <Route path="/postview" element={<Layout><PostsView /></Layout>} />
      <Route path="/tasks" element={<Layout><TaskCorner /></Layout>} />
      <Route path="/tasks/:taskId" element={<Layout><TaskView /></Layout>} />

      {/* Interactivity Routes */}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />

<<<<<<< HEAD
      {/* Group Management Routes */}
      <Route path="/groups" element={<Layout><GroupView /></Layout>} />
      <Route path="/groups/:groupId/chat" element={<Layout><GroupChat /></Layout>} />

      {/* Game routes - Add here as needed */}
=======
      {/*Game routes*/}
      <Route path="/gamehub" element={<Layout><DashboardActions /></Layout>} />
      <Route path="/gamehub/quiz" element={<Layout><Quiz /></Layout>} />
      <Route path="/gamehub/quiz-summary" element={<Layout><QuizSummary /></Layout>} />         
      <Route path="/gamehub/memory-match" element={<Layout><MemoryMatchGame /></Layout>} />
      <Route path="/gamehub/memory-match-summary" element={<Layout><MemoryMatchSummary /></Layout>} />
      <Route path="/gamehub/progress" element={<Layout><Progress /></Layout>} />
      <Route path="/gamehub/games" element={<Layout><GameList /></Layout>} />
      <Route path="/gamehub/game/:id" element={<Layout><GameView /></Layout>} />
      <Route path="/gamehub/categories" element={<Layout><CategorySelection /></Layout>} />

      {/*Admin Game Management Routes*/}
      <Route path="/admin/games" element={<Layout><AddGame /></Layout>} />
      <Route path="/admin/mcq-list" element={<Layout><MCQList /></Layout>} />
      <Route path="/admin/memory-match-list" element={<Layout><MemoryMatchList /></Layout>} />
      <Route path="/admin/add-mcq-set" element={<Layout><AddMCQSet /></Layout>} />
      <Route path="/admin/edit-mcq/:id" element={<Layout><EditMcqGame /></Layout>} />
      <Route path="/admin/edit-memory-match/:id" element={<Layout><EditMemoryMatchGame /></Layout>} />
      <Route path="/admin/add-memory-match-game" element={<Layout><AddMemoryMatchGame /></Layout>} />

      {/*Group routes*/}

>>>>>>> f4cd11f7e88c06bb877250219bf200d85541a01e
    </Routes>
  );
}

export default App;
