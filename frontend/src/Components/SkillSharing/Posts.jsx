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
  Snackbar,
  Alert,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please login to access posts');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    fetchPosts();
  }, [navigate]);

  const categories = [
    'Technology',
    'Science',
    'Art',
    'Music',
    'Sports',
    'Education',
    'Other',
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (post = null) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please login to create or edit posts');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    if (post) {
      setCurrentPost({
        postId: post.postId,
        title: post.title,
        content: post.content,
        category: post.category,
      });
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
    setCurrentPost({
      title: '',
      content: '',
      category: '',
    });
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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please login to create or edit posts');
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

      if (editMode) {
        await axios.put(
          `http://localhost:8080/api/posts/${currentPost.postId}?userId=${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setSuccess('Post updated successfully!');
      } else {
        await axios.post(
          `http://localhost:8080/api/posts/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setSuccess('Post created successfully!');
      }

      handleCloseDialog();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(error.response?.data?.message || 'Failed to save post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
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
      await axios.delete(`http://localhost:8080/api/posts/${postId}?userId=${userId}`);
      setSuccess('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(error.response?.data?.message || 'Failed to delete post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          disabled={loading}
        >
          <AddIcon className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

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
                    disabled={loading}
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.postId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
            <FormControl fullWidth className="mb-4">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={currentPost.category}
                onChange={handleInputChange}
                required
                label="Category"
                disabled={loading}
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
              disabled={loading}
            >
              <label className="w-full cursor-pointer flex items-center justify-center gap-2">
                <span>Upload Media</span>
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={loading}
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : editMode ? 'Update' : 'Create'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posts;
