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
import TaskView from './Components/SkillSharing/TaskView';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      
      {/*User routes*/}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={ <Layout>  <Home /> </Layout>} />
      <Route path="/profile" element={<Profile />} />
      

      {/*skillsharing routes*/}
      <Route path="/TaskCorner" element={<TaskCorner />} />
      <Route path="/postview" element= {<Layout>  <PostsView /> </Layout>} />
      <Route path="/posts" element= {<Layout>  <Posts /> </Layout>} />
      <Route path="/tasks" element={<TaskCorner />} />
      <Route path="/tasks/:taskId" element={<TaskView />} />
      

      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />





      {/*Group routes*/}





      {/*Game routes*/}





    </Routes>
  );
}

export default App;
