import React, { useEffect, useState } from "react";
import axios from "axios";
import Posts from "../SkillSharing/Posts";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const navigate = useNavigate();

  // Dummy posts for fallback
  const dummyPosts = [
    {
      postId: 1,
      title: "Welcome to Asphira!",
      content: "This is a sample post to get you started. Share your skills and connect with others!",
      mediaList: [],
      views: 42,
      category: "Technology",
      createdAt: new Date().toISOString(),
    },
    {
      postId: 2,
      title: "Share your first post!",
      content: "Click 'Start a post' above to share your knowledge, experience, or ask a question.",
      mediaList: [],
      views: 17,
      category: "Education",
      createdAt: new Date().toISOString(),
    },
    {
      postId: 3,
      title: "Asphira Community",
      content: "Join groups, save posts, and grow your network on Asphira.",
      mediaList: [],
      views: 8,
      category: "Community",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        // Fetch user info
        const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUser(userRes.data);
        // Fetch posts
        const postsRes = await axios.get("http://localhost:8080/api/posts");
        setPosts(postsRes.data.length > 0 ? postsRes.data : dummyPosts);
      } catch (err) {
        setError("Failed to fetch data");
        setPosts(dummyPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showPostDialog]); // refetch posts after dialog closes

  // Handler to open the Posts dialog
  const handleOpenPostDialog = () => setShowPostDialog(true);
  const handleClosePostDialog = () => setShowPostDialog(false);

  // Navigation links
  const navLinks = [
    { name: "Home", icon: "🏠", path: "/home", active: true },
    { name: "My Network", icon: "👥", path: "/network" },
    { name: "Groups", icon: "👨‍👩‍👧‍👦", path: "/groups" },
    { name: "Task Corner", icon: "📝", path: "/Task-Corner" },
    { name: "Saved", icon: "🔖", path: "/saved" },
    { name: "Events", icon: "📅", path: "/events" },
    { name: "Newsletters", icon: "📰", path: "/newsletters" },
    { name: "Profile", icon: "🙍‍♀️", path: "/profile" },
  ];

  const handleNav = (path) => {
    if (path === "/home") return; // Already on home
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Asphira Logo/Header */}
      <header className="w-full bg-white shadow mb-6 py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-700 tracking-wide">Asphira</span>
        </div>
        <span className="text-gray-500 font-semibold">Skill Sharing & Learning Platform</span>
      </header>
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar as Navigation Bar */}
        <aside className="md:col-span-1 space-y-4">
          <nav className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            {/* Logo */}
            <div className="mb-6 flex flex-col items-center">
              <img
                src="/asphira-logo.png"
                alt="Asphira Logo"
                className="w-16 h-16 rounded-full border-2 border-blue-600 mb-2 bg-white object-cover"
                onError={e => { e.target.onerror = null; e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg'; }}
              />
              <span className="font-bold text-xl text-blue-700">Asphira</span>
            </div>
            {/* Navigation Links */}
            <ul className="w-full space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition-colors ${link.active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}
                    onClick={() => handleNav(link.path)}
                  >
                    <span className="text-lg">{link.icon}</span> {link.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <span className="text-lg">🚪</span> Logout
                </button>
              </li>
            </ul>
          </nav>
          {/* User Card */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            {user ? (
              <>
                <img
                  src={user.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mb-2"
                />
                <h2 className="font-bold text-lg">{user.fullName || user.username}</h2>
                <p className="text-gray-500 text-sm">{user.location || "Location not set"}</p>
                <button className="mt-3 px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  + Experience
                </button>
              </>
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400">Loading...</div>
            )}
          </div>
        </aside>

        {/* Main Feed */}
        <main className="md:col-span-2 space-y-6">
          {/* Start a post */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <input
                type="text"
                placeholder="Start a post"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none cursor-pointer"
                onClick={handleOpenPostDialog}
                readOnly
              />
            </div>
            <div className="flex justify-between mt-4">
              <button className="flex items-center gap-1 text-blue-600 font-semibold" onClick={handleOpenPostDialog}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" /><path fillRule="evenodd" d="M2 13.5A4.5 4.5 0 016.5 9h7A4.5 4.5 0 0118 13.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1v-2.5z" clipRule="evenodd" /></svg>
                Video
              </button>
              <button className="flex items-center gap-1 text-green-600 font-semibold" onClick={handleOpenPostDialog}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 100 2 1 1 0 000-2zm8 6H6v-1l2.293-2.293a1 1 0 011.414 0L12 11l2-2 2 2v1z" /></svg>
                Photo
              </button>
              <button className="flex items-center gap-1 text-orange-600 font-semibold" onClick={handleOpenPostDialog}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17 8h2a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9a1 1 0 011-1h2V7a5 5 0 1110 0v1zm-2 0V7a3 3 0 10-6 0v1h6z" /></svg>
                Write article
              </button>
            </div>
          </div>
          {/* Feed Posts */}
          {loading ? (
            <div className="text-center text-gray-400">Loading posts...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400">No posts found.</div>
          ) : (
            posts.map((post) => (
              <div key={post.postId} className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center mb-2">
                  <img
                    src={user?.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-semibold">{user?.fullName || user?.username || "User"}</div>
                    <div className="text-xs text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</div>
                  </div>
                </div>
                <div className="mb-2 font-semibold">{post.title}</div>
                <div className="mb-2 text-gray-700">{post.content}</div>
                {post.mediaList && post.mediaList.length > 0 && (
                  post.mediaList[0].mediaType === "VIDEO" ? (
                    <video
                      src={post.mediaList[0].mediaUrl}
                      controls
                      className="w-full rounded-lg mb-2"
                    />
                  ) : (
                    <img
                      src={post.mediaList[0].mediaUrl}
                      alt="Media"
                      className="w-full rounded-lg mb-2"
                    />
                  )
                )}
                <div className="text-xs text-gray-500">Views: {post.views} | Category: {post.category}</div>
              </div>
            ))
          )}
          {/* Posts creation dialog/modal */}
          {showPostDialog && <Posts openDialog={showPostDialog} onClose={handleClosePostDialog} />}
        </main>

        {/* Right Sidebar */}
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">Today's puzzle</div>
            <div className="text-sm text-gray-500">Zip - a quick brain teaser</div>
            <button className="mt-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Solve now</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">Add to your feed</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Vivek Ramaswamy</span>
                <button className="text-blue-600 font-semibold text-xs">+ Follow</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Work From Home Jobs</span>
                <button className="text-blue-600 font-semibold text-xs">+ Follow</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Google</span>
                <button className="text-blue-600 font-semibold text-xs">+ Follow</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">See who's hiring on Asphira.</div>
            <img
              src="https://media.licdn.com/media/AAYQAgSrAAgAAQAAAAAAABb1AAAAJDE2YjQwYjYwLTYwYjItNDYwZi1hYjYwLTYwYjQwYjYwYjYwYjYw.jpg"
              alt="Hiring"
              className="w-full rounded-lg"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
