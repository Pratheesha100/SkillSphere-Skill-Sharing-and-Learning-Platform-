import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Components/UserManagement/Home.jsx';
import AuthPage from './Components/UserManagement/AuthPage.jsx';
import DatabaseCheck from './Components/Interactivity&Engagement/DatabaseCheck.jsx';
import ProfileUpdate from './Components/UserManagement/ProfileUpdate.jsx';
import TaskCorner from './Components/SkillSharing/TaskCorner.jsx';
import Posts from './Components/SkillSharing/Posts';
import Layout from "./Components/Navigation/Layout";
import PostsView from "./Components/SkillSharing/PostsView";


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      
      {/*User routes*/}
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={ <Layout>  <Home /> </Layout>} />
      <Route path="/profile" element={<ProfileUpdate />} />
      

      {/*skillsharing routes*/}
      <Route path="/TaskCorner" element={<TaskCorner />} />
      <Route path="/postview" element= {<Layout>  <PostsView /> </Layout>} />
      <Route path="/posts" element= {<Layout>  <Posts /> </Layout>} />
      

      {/*Interactivity routes*/}
      <Route path="/test-database-connection" element={<DatabaseCheck />} />





      {/*Group routes*/}





      {/*Game routes*/}





    </Routes>
  );
}

export default App
