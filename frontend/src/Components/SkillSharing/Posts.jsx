import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Snackbar, Alert, Modal, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {Edit as EditIcon, Delete as DeleteIcon, Videocam, Image, Article, MoreVert, WarningAmber as WarningAmberIcon, DeleteForever as DeleteForeverIcon, Cancel as CancelIcon } from '@mui/icons-material';
import PostCreate from './PostCreate';
import PostUpdate from './PostUpdate';
import avatar from '../../assets/avatar.png';
import { ThumbsUp, MessageCircle, Bookmark, Hand, Heart, Lightbulb, Laugh, HandHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';

const categoriesFromProps = [
  'Technology',
  'Science',
  'Art',
  'Music',
  'Sports',
  'Education',
  'Other',
];
const categories = ['All', ...categoriesFromProps];

const reactionEmojis = [
  { icon: <ThumbsUp className="text-blue-600 w-7 h-7" />, label: 'Like' },
  { icon: <Hand className="text-green-600 w-7 h-7" />, label: 'Celebrate' },
  { icon: <HandHeart className="text-purple-600 w-7 h-7" />, label: 'Support' },
  { icon: <Heart className="text-red-600 w-7 h-7" />, label: 'Love' },
  { icon: <Lightbulb className="text-yellow-500 w-7 h-7" />, label: 'Insightful' },
  { icon: <Laugh className="text-cyan-600 w-7 h-7" />, label: 'Funny' },
];

// Define category colors map
const categoryColors = {
  Technology: 'bg-sky-100 text-sky-700',
  Science: 'bg-green-100 text-green-700',
  Art: 'bg-purple-100 text-purple-700',
  Music: 'bg-pink-100 text-pink-700',
  Sports: 'bg-orange-100 text-orange-700',
  Education: 'bg-amber-100 text-amber-700',
  Other: 'bg-slate-100 text-slate-700',
  All: 'bg-gray-100 text-gray-800',
  default: 'bg-gray-100 text-gray-700' // Fallback
};

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

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
    fetchPosts(token, activeCategory);
    // Optionally fetch user info here
  }, [navigate, activeCategory]);

  const fetchPosts = async (token, categoryToFetch) => {
    try {
      setLoading(true);
      let url = 'http://localhost:8080/api/posts';
      if (categoryToFetch && categoryToFetch !== 'All') {
        url = `http://localhost:8080/api/posts/category/${categoryToFetch}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
      setError(null);
    } catch (error) {
      if (categoryToFetch && categoryToFetch !== 'All' && error.response && error.response.status === 404) {
        setPosts([]);
        setError(null);
      } else {
        setPosts([]);
        setError('Failed to fetch posts. Please try again later.');
      }
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
      fetchPosts(token, activeCategory);
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
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Post deleted successfully!');
      fetchPosts(token, activeCategory);
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
    if (token) fetchPosts(token, activeCategory);
    setOpenModal(false);
  };

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuPostId(postId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuPostId(null);
  };

  const handleEditClick = (post) => {
    setPostToEdit(post);
    setIsEditModalOpen(true);
    handleMenuClose(); // Close the MoreVert menu
  };

  const handlePostUpdated = () => {
    setIsEditModalOpen(false);
    setPostToEdit(null);
    setSuccess('Post updated successfully!');
    const token = localStorage.getItem('token');
    if (token) fetchPosts(token, activeCategory); // Refresh posts list
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    fetchPosts(localStorage.getItem('token'), categoryName);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f8fa 0%, #e8f0f8 20%, #f5eef1 40%, #edf5ef 60%, #f2f7f0 80%, #f0f8fa 100%)' }}>
      <div className="container mx-auto pt-8 flex gap-0 flex-1">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/6 flex flex-col gap-4 ml-24">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-r-4 border-b-4 border-l-slate-50 border-t-slate-50 border-gray-400 w-full">
            <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full mb-3" />
            <div className="text-lg font-bold">{user.name}</div>
            <div className="text-gray-500 text-sm mb-2">{user.location}</div>
            <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-full text-sm">+ Experience</button>
          </div>
          {/* Categories Section */}
          <div className="bg-white rounded-xl shadow-md p-4 pl-4 mt-2 w-full">
            <div className="font-semibold text-gray-700 mb-2 ml-2">Categories</div>
            <ul className="flex flex-col gap-1 ml-2">
              {categories.map((cat) => (
                <li 
                  key={cat} 
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors duration-150 ease-in-out 
                    ${activeCategory === cat 
                      ? 'bg-blue-500 text-white font-semibold shadow-sm' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}
                  onClick={() => handleCategoryClick(cat)}
                >
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
            {/* Post Creation Card  */}
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-xl shadow p-4 mb-2">
                <div className="flex items-center gap-1 mb-2">
                  <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                  <div
                    className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-500 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setOpenModal(true)}
                  > Start a post
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
            <div className="w-full max-w-3xl bg-transparent rounded-xl shadow-sm p-4 md:p-2 mt-2 mb-3">
              {loading && (
                <div className="text-center py-10">
                  <CircularProgress />
                  <p className="text-gray-500 mt-2">Loading posts...</p>
                </div>
              )}
              {!loading && posts.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl shadow p-6">
                  <p className="text-xl text-gray-500 font-medium">
                    {activeCategory === 'All' 
                      ? 'No posts available yet. Be the first to create one!' 
                      : `No posts found in "${activeCategory}".`}
                  </p>
                </div>
              )}
              {!loading && posts.length > 0 && (
                <div className="flex flex-col gap-1 mt-0">
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
                            anchorEl={anchorEl}
                            open={openMenuPostId === post.postId}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            container={document.body}
                            PaperProps={{
                              elevation: 0,
                              sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                mt: 1.5,
                                borderRadius: '8px',
                                '& .MuiAvatar-root': {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                                },
                                '&:before': {
                                  content: '""',
                                  display: 'block',
                                  position: 'absolute',
                                  top: 0,
                                  right: 14,
                                  width: 10,
                                  height: 10,
                                  bgcolor: 'background.paper',
                                  transform: 'translateY(-50%) rotate(45deg)',
                                  zIndex: 0,
                                },
                              },
                            }}
                          >
                            <MenuItem onClick={() => {
                              setPostIdToDelete(post.postId);
                              setDeleteDialogOpen(true);
                              handleMenuClose();
                            }} sx={{ paddingY: '8px', paddingX: '16px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '6px'} }}>
                              <DeleteIcon fontSize="small" className="mr-2" /> Delete
                            </MenuItem>
                            <MenuItem onClick={() => handleEditClick(post)} sx={{ paddingY: '8px', paddingX: '16px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '6px'} }}>
                              <EditIcon fontSize="small" className="mr-2" /> Edit
                            </MenuItem>
                          </Menu>
                        </div>
                        {/* Add top padding to content to avoid overlap */}
                        <div className="pt-5">
                          {/* Text Content Block */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-gray-300" />
                                <div>
                                  <div className="font-semibold text-gray-900 text-lg">{post.title}</div>
                                  <span 
                                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${categoryColors[post.category] || categoryColors.default} mr-2 mt-1`}
                                  >
                                    {post.category}
                                  </span>
                                </div>
                              </div>
                              <div className="text-gray-700 mb-2 text-base leading-relaxed break-words">
                                {post.content}
                                {/* Hashtags */}
                                <div className="mt-1">
                                  {post.hashtags && post.hashtags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-blue-600 font-medium cursor-pointer hover:underline mr-2"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Right side of this flex is now empty as media moved below */}
                          </div>

                          {/* Media Section */}
                          {hasMedia && (
                            <div className="flex flex-col gap-2 mt-3">
                              {/* First media: big */}
                              <div>
                                {post.mediaList[0].mediaType === 'VIDEO' ? (
                                  <video
                                    src={post.mediaList[0].mediaUrl}
                                    controls
                                    className="w-full max-h-96 rounded-xl object-cover"
                                  />
                                ) : (
                                  <img
                                    src={post.mediaList[0].mediaUrl}
                                    alt={`${post.title} - main media`}
                                    className="w-full max-h-96 rounded-xl object-cover"
                                  />
                                )}
                              </div>
                              {/* Other media: larger thumbnails */}
                              {isMultiMedia && (
                                <div className="flex flex-row flex-wrap gap-2">
                                  {post.mediaList.slice(1).map((mediaItem, idx) => (
                                    <div key={idx} className="w-40 h-32">
                                      {mediaItem.mediaType === 'VIDEO' ? (
                                        <video
                                          src={mediaItem.mediaUrl}
                                          controls
                                          className="w-full h-full rounded-lg object-cover"
                                        />
                                      ) : (
                                        <img
                                          src={mediaItem.mediaUrl}
                                          alt={`${post.title} - media ${idx + 2}`}
                                          className="w-full h-full rounded-lg object-cover"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions Bar - MOVED to be a direct child of pt-5, after text and media */}
                          <div className="relative mt-3"> {/* Added mt-3 for spacing */}
                            <div className="flex justify-around items-center border-t pt-3 text-gray-500 text-sm font-medium">
                              <button
                                className="flex items-center gap-1 hover:text-blue-600 transition relative"
                                onMouseEnter={() => setLikePopupIdx(idx)} // idx is from posts.map()
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
                            <AnimatePresence>
                              {likePopupIdx === idx && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="absolute left-[-7%] -translate-x-1/2 bottom-10 z-20 flex gap-2 sm:gap-3 bg-white rounded-3xl shadow-xl px-3 sm:px-4 py-2 border border-gray-200"
                                  onMouseEnter={() => setLikePopupIdx(idx)}
                                  onMouseLeave={() => setLikePopupIdx(null)}
                                >
                                  {reactionEmojis.map((r, i) => (
                                    <motion.div
                                      key={i}
                                      className="flex flex-col items-center cursor-pointer group"
                                      whileHover={{ scale: 1.15, y: -4 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                    >
                                      {React.cloneElement(r.icon, { className: `${r.icon.props.className} group-hover:brightness-110` })}
                                      <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 font-medium">{r.label}</span>
                                    </motion.div>
                                  ))}
                                  {/* Small arrow pointing down */}
                                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 z-[-1]"></div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Snackbar for errors and success */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%', boxShadow: 3, fontSize: '1.05rem' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%', boxShadow: 3, fontSize: '1.05rem' }}>
          {success}
        </Alert>
      </Snackbar>
      {/* Edit Post Modal */}
      {postToEdit && (
        <PostUpdate
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setPostToEdit(null);
          }}
          postData={postToEdit}
          onPostUpdated={handlePostUpdated}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '10px',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon sx={{ color: 'warning.main', fontSize: '2rem' }} />
          Delete Post Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginTop: 1 }}>
            Are you sure you want to permanently delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingRight: '20px', paddingBottom: '16px' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="inherit" 
            startIcon={<CancelIcon />}
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleDelete(postIdToDelete);
              setDeleteDialogOpen(false);
            }}
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posts;
