import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    category: '',
  });

  const categories = [
    'Technology',
    'Science',
    'Art',
    'Music',
    'Sports',
    'Education',
    'Other',
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleOpenDialog = (post = null) => {
    if (post) {
      setCurrentPost(post);
      setEditMode(true);
    } else {
      setCurrentPost({
        title: '',
        content: '',
        category: '',
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setEditMode(false);
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
      const formData = new FormData();
      formData.append('title', currentPost.title);
      formData.append('content', currentPost.content);
      formData.append('category', currentPost.category);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('mediaType', selectedFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO');
      }

      if (editMode) {
        await axios.put(`http://localhost:8080/api/posts/${currentPost.postId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`http://localhost:8080/api/posts/${localStorage.getItem('userId')}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      handleCloseDialog();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}?userId=${localStorage.getItem('userId')}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <AddIcon className="w-5 h-5" />
          Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.postId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {post.mediaList && post.mediaList.length > 0 && (
              <div className="relative h-48">
                {post.mediaList[0].mediaType === 'VIDEO' ? (
                  <video
                    src={post.mediaList[0].mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={post.mediaList[0].mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Category: {post.category}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDialog(post)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.postId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <DeleteIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-xl font-semibold">
            {editMode ? 'Edit Post' : 'Create New Post'}
          </span>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={currentPost.title}
              onChange={handleInputChange}
              required
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={currentPost.content}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
              className="mb-4"
            />
            <FormControl fullWidth className="mb-4">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={currentPost.category}
                onChange={handleInputChange}
                required
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
              type="button"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <label className="w-full cursor-pointer flex items-center justify-center gap-2">
                <span>Upload Media</span>
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            </button>
            {previewUrl && (
              <div className="mt-4">
                {selectedFile?.type.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-lg"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full h-auto max-h-48 rounded-lg"
                  />
                )}
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions className="p-4">
          <button
            onClick={handleCloseDialog}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editMode ? 'Update' : 'Create'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posts;
