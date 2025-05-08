import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Snackbar, Alert, Modal, Menu, MenuItem} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon, Videocam, Image, Article, MoreVert} from '@mui/icons-material';
import PostCreate from './PostCreate';
import avatar from '../../assets/avatar.png';
import { ThumbsUp, MessageCircle, Bookmark, Hand, Heart, Lightbulb, Laugh, HandHeart } from 'lucide-react';

const categories = [
  'Technology',
  'Science',
  'Art',
  'Music',
  'Sports',
  'Education',
  'Other',
];

const reactionEmojis = [
  { icon: <ThumbsUp className="text-blue-600 w-7 h-7" />, label: 'Like' },
  { icon: <Hand className="text-green-600 w-7 h-7" />, label: 'Celebrate' },
  { icon: <HandHeart className="text-purple-600 w-7 h-7" />, label: 'Support' },
  { icon: <Heart className="text-red-600 w-7 h-7" />, label: 'Love' },
  { icon: <Lightbulb className="text-yellow-500 w-7 h-7" />, label: 'Insightful' },
  { icon: <Laugh className="text-cyan-600 w-7 h-7" />, label: 'Funny' },
];

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [user, setUser] = useState({
    name: 'Your Name',
    location: 'Your Location',
    avatar: avatar,
  });
  const [openModal, setOpenModal] = useState(false);
  const [likePopupIdx, setLikePopupIdx] = useState(null);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to access posts');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    // Try to get user name from localStorage (if stored at login)
    let userName = 'Your Name';
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        if (userObj.name) userName = userObj.name;
      }
    } catch (e) {}
    setUser((prev) => ({ ...prev, name: userName }));
    const userData = localStorage.getItem('user');
    console.log('userData from localStorage:', userData);
    fetchPosts(token);
    // Optionally fetch user info here
  }, [navigate]);

  const fetchPosts = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to create posts');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
      const formData = new FormData();
      formData.append('title', currentPost.title);
      formData.append('content', currentPost.content);
      formData.append('category', currentPost.category);
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('mediaType', selectedFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO');
      }
      await axios.post(
        `http://localhost:8080/api/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );
      setSuccess('Post created successfully!');
      setCurrentPost({ title: '', content: '', category: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      fetchPosts(token);
    } catch (error) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to delete posts');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Post deleted successfully!');
      fetchPosts(token);
    } catch (error) {
      setError('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Add a handler to refresh posts after post creation
  const handlePostCreated = () => {
    const token = localStorage.getItem('token');
    if (token) fetchPosts(token);
    setOpenModal(false);
  };

  const handleMenuOpen = (event, postId) => {
    setMenuAnchorEls((prev) => ({ ...prev, [postId]: event.currentTarget }));
  };
  const handleMenuClose = (postId) => {
    setMenuAnchorEls((prev) => ({ ...prev, [postId]: null }));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f8fa 0%, #e8f0f8 20%, #f5eef1 40%, #edf5ef 60%, #f2f7f0 80%, #f0f8fa 100%)' }}>
      <div className="container mx-auto pt-8 flex gap-0 flex-1">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/6 flex flex-col gap-4 ml-24">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-r-4 border-b-4 border-blue-800 w-full">
            <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full mb-3" />
            <div className="text-lg font-bold">{user.name}</div>
            <div className="text-gray-500 text-sm mb-2">{user.location}</div>
            <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-full text-sm">+ Experience</button>
          </div>
          {/* Categories Section */}
          <div className="bg-white rounded-xl shadow-md p-4 pl-4 mt-2 w-full">
            <div className="font-semibold text-gray-700 mb-2 ml-2">Categories</div>
            <ul className="flex flex-col gap-2 ml-2">
              {categories.map((cat) => (
                <li key={cat} className="text-gray-600 hover:text-blue-700 cursor-pointer transition">
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 pl-4">
          {/* Stack post creation and feed vertically */}
          <div className="w-full flex flex-col">
            {/* Post Creation Card (moved out of feed container) */}
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-xl shadow p-4 mb-8">
                <div className="flex items-center gap-1 mb-2">
                  <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                  <div
                    className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-500 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setOpenModal(true)}
                  >
                    Start a post
                  </div>
                </div>
                <div className="flex justify-around mt-2">
                  <button className="flex items-center gap-1 text-[#ff6186] font-medium text-sm">
                    <Videocam style={{ color: '#ff6186' }} /> Video
                  </button>
                  <button className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                    <Image style={{ color: '#367dee' }} /> Photo
                  </button>
                  <button className="flex items-center gap-1 text-[#4c956c] font-medium text-sm">
                    <Article style={{ color: '#4c956c' }} /> Write article
                  </button>
                </div>
                <Modal 
                  open={openModal} 
                  onClose={() => setOpenModal(false)}
                  slotProps={{
                    backdrop: {
                      sx: {
                        backgroundColor: 'rgba(20, 20, 30, 0.75)',
                        backdropFilter: 'blur(6px)',
                      }
                    }
                  }}
                >
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto">
                      <PostCreate onClose={handlePostCreated} />
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            {/* Feed Container */}
            <div className="w-full max-w-3xl bg-gray-50 rounded-xl shadow-sm p-4 md:p-4 my-4">
              {/* Posts Feed */}
              <div className="flex flex-col gap-2 mt-1">
                {posts.map((post, idx) => {
                  const hasMedia = post.mediaList && post.mediaList.length > 0;
                  const isSingleMedia = hasMedia && post.mediaList.length === 1;
                  const isMultiMedia = hasMedia && post.mediaList.length > 1;
                  return (
                    <div
                      key={post.postId}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition hover:shadow-md group flex flex-col gap-2 mb-4 relative"
                    >
                      {/* Top-right controls row */}
                      <div className="flex justify-end items-center gap-2 absolute top-4 right-4 z-10">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm transition"
                        >
                          Follow
                        </button>
                        <button
                          className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                          onClick={(e) => handleMenuOpen(e, post.postId)}
                        >
                          <MoreVert fontSize="small" />
                        </button>
                        <Menu
                          anchorEl={menuAnchorEls[post.postId]}
                          open={Boolean(menuAnchorEls[post.postId])}
                          onClose={() => handleMenuClose(post.postId)}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          container={document.body}
                        >
                          <MenuItem onClick={() => { handleMenuClose(post.postId); /* TODO: Add edit logic */ }}>
                            <EditIcon fontSize="small" className="mr-2" /> Edit
                          </MenuItem>
                          <MenuItem onClick={() => { handleMenuClose(post.postId); handleDelete(post.postId); }}>
                            <DeleteIcon fontSize="small" className="mr-2" /> Delete
                          </MenuItem>
                        </Menu>
                      </div>
                      {/* Add top padding to content to avoid overlap */}
                      <div className="pt-10">
                        <div className="flex items-start justify-between gap-4">
                          {/* Content Section */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-gray-300" />
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">{post.title}</div>
                                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 mr-2 mt-1">
                                  {post.category}
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-700 mb-2 text-base leading-relaxed break-words">
                              {post.content}
                            </div>
                            {/* If multiple media, show thumbnails below main media */}
                            {isMultiMedia && (
                              <div className="flex flex-row flex-wrap gap-2 mt-2">
                                {post.mediaList.slice(1).map((mediaItem, idx) => (
                                  <div key={idx}>
                                    {mediaItem.mediaType === 'VIDEO' ? (
                                      <video
                                        src={mediaItem.mediaUrl}
                                        controls
                                        className="w-20 h-14 md:w-24 md:h-16 rounded-lg object-cover border border-gray-200"
                                      />
                                    ) : (
                                      <img
                                        src={mediaItem.mediaUrl}
                                        alt={`${post.title} - media ${idx + 2}`}
                                        className="w-20 h-14 md:w-24 md:h-16 rounded-lg object-cover border border-gray-200"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Main Media Section (single or first media) */}
                          {hasMedia && (
                            <div className="flex-shrink-0 ml-4 mt-2">
                              {post.mediaList[0].mediaType === 'VIDEO' ? (
                                <video
                                  src={post.mediaList[0].mediaUrl}
                                  controls
                                  className="w-48 h-36 md:w-64 md:h-44 rounded-xl object-cover border border-gray-200"
                                />
                              ) : (
                                <img
                                  src={post.mediaList[0].mediaUrl}
                                  alt={`${post.title} - main media`}
                                  className="w-48 h-36 md:w-64 md:h-44 rounded-xl object-cover border border-gray-200"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        {/* Actions Bar */}
                        <div className="relative">
                          <div className="flex justify-around items-center border-t pt-3 mt-3 text-gray-500 text-sm font-medium">
                            <button
                              className="flex items-center gap-1 hover:text-blue-600 transition relative"
                              onMouseEnter={() => setLikePopupIdx(idx)}
                              onMouseLeave={() => setLikePopupIdx(null)}
                            >
                              <ThumbsUp className="w-5 h-5" /> Like
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-600 transition">
                              <MessageCircle className="w-5 h-5" /> Comment
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-600 transition">
                              <Bookmark className="w-5 h-5" /> Saved
                            </button>
                          </div>
                          {/* Emoji popup for Like */}
                          {likePopupIdx === idx && (
                            <div
                              className="absolute left-1/2 -translate-x-1/2 bottom-12 z-20 flex gap-2 bg-white rounded-full shadow-lg px-4 py-2 border"
                              onMouseEnter={() => setLikePopupIdx(idx)}
                              onMouseLeave={() => setLikePopupIdx(null)}
                            >
                              {reactionEmojis.map((r, i) => (
                                <div key={i} className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
                                  {r.icon}
                                  {/* <span className="text-xs mt-1">{r.label}</span> */}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Snackbar for errors and success */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Posts;
