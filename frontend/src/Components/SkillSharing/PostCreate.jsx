import React, { useState } from 'react';
import { Modal, TextField, Button, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const categories = [
  'Technology',
  'Science',
  'Art',
  'Music',
  'Sports',
  'Education',
  'Other',
];

function PostCreate({ onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Separate images and videos
    const images = selectedFiles.filter(f => f.type.startsWith('image/'));
    const videos = selectedFiles.filter(f => f.type.startsWith('video/'));
    // Enforce max 3 images and 1 video
    let newImages = images.slice(0, 3);
    let newVideos = videos.slice(0, 1);
    if (images.length > 3) {
      setError('You can upload up to 3 images only.');
    } else if (videos.length > 1) {
      setError('You can upload only 1 video.');
    } else {
      setError(null);
    }
    const newFiles = [...newImages, ...newVideos];
    setFiles(newFiles);
    // Generate previews
    const readers = newFiles.map(f => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f);
      });
    });
    Promise.all(readers).then(urls => setPreviewUrls(urls));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      // 1. Create the post
      const postRes = await axios.post(
        'http://localhost:8080/api/posts',
        { title, content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const postId = postRes.data.postId;
      // 2. If media, upload each file (up to 3 images and 1 video)
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('postId', postId);
        formData.append('mediaType', file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO');
        await axios.post('http://localhost:8080/api/media/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccess('Post created successfully!');
      // Wait for 1 second to show success message before navigating
      setTimeout(() => {
        onClose();
        // Navigate to posts page
        window.location.href = '/posts';
      }, 1000);
    } catch (err) {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Create Post</h2>
      <TextField
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={loading}
        fullWidth
      />
      <TextField
        label="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        multiline
        minRows={3}
        disabled={loading}
        fullWidth
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
        disabled={loading}
        fullWidth
      >
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
      >
        Upload Media (max 3 images, 1 video)
        <input
          type="file"
          hidden
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
        />
      </Button>
      {previewUrls.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="">
              {file.type.startsWith('image/') ? (
                <img src={previewUrls[idx]} alt="Preview" className="max-w-[120px] max-h-32 rounded-lg" />
              ) : (
                <video src={previewUrls[idx]} controls className="max-w-[120px] max-h-32 rounded-lg" />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <Button variant="contained" color="primary" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Post'}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
      </div>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </form>
  );
}

export default PostCreate;
