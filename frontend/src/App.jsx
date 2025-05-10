import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import Profile from './Components/UserManagement/Profile.jsx';
import TaskCorner from './Components/SkillSharing/TaskCorner.jsx';
import Posts from './Components/SkillSharing/Posts';
import Layout from "./Components/Navigation/Layout";
import PostsView from "./Components/SkillSharing/PostsView";
import Notifications from './Components/Interactivity&Engagement/Notifications';
import Leaderboard from './Components/Interactivity&Engagement/Leaderboard';
import AboutUs from './Components/UserManagement/AboutUs';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      
      {/*User routes*/}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={ <Layout>  <Home /> </Layout>} />
      <Route path="/profile" element={ <Layout> <Profile /> </Layout>} />
      

      {/*skillsharing routes*/}
      <Route path="/TaskCorner" element={<Layout> <TaskCorner /> </Layout>} />
      <Route path="/postview" element= {<Layout>  <PostsView /> </Layout>} />
      <Route path="/posts" element= {<Layout>  <Posts /> </Layout>} />
      

      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />
      <Route path="/notifications" element={<Layout> <Notifications /> </Layout>} />
      <Route path="/leaderboard" element={<Layout> <Leaderboard /> </Layout>} />
      <Route path="/about" element={<Layout> <AboutUs /> </Layout>} />




      {/*Group routes*/}





      {/*Game routes*/}





    </Routes>
  );
}

export default App
