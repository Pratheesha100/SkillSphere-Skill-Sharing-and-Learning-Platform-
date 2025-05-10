import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon, Send as SendIcon, MessageCircle as MessageCircleIcon } from 'lucide-react';
import { Avatar, TextField, Button, CircularProgress, Typography, Paper, IconButton, Divider } from '@mui/material';
import avatarPlaceholder from '../../assets/avatar.png'; // Default avatar

// Helper to format date (simplified)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CommentDrawer = ({ postId, currentUser, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [error, setError] = useState(null);
  const commentsEndRef = useRef(null);

  const loggedInUserId = JSON.parse(localStorage.getItem('user'))?.userId;


  const fetchComments = async () => {
    if (!postId) return;
    setIsLoadingComments(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data?._embedded?.commentDTOList || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Could not load comments.');
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    // Scroll to bottom when new comments are added
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !loggedInUserId) {
      setError('Comment cannot be empty and user must be logged in.');
      return;
    }
    setIsPostingComment(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const payload = {
        content: newComment,
        postId: postId,
      };
      await axios.post('http://localhost:8080/api/comments', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not post comment.');
    } finally {
      setIsPostingComment(false);
    }
  };

  const drawerVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
  };

  // Placeholder for commenter details if not provided by backend DTO
  const getCommenterDetails = (comment) => {
    return {
      name: comment.commenterUsername || `User ${comment.userId}`,
      avatarUrl: comment.commenterAvatarUrl || avatarPlaceholder,
    };
  };

  return (
    <AnimatePresence>
      {postId && (
        <motion.div
          key="commentDrawer"
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white border-t border-gray-300 shadow-2xl z-50 flex flex-col"
          style={{ maxHeight: 'calc(100vh - 60px)' }} // Avoid overlapping a potential top navbar
        >
          <Paper elevation={0} className="p-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b">
            <Typography variant="h6" className="font-semibold">Comments</Typography>
            <IconButton onClick={onClose} size="small">
              <XIcon />
            </IconButton>
          </Paper>

          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {isLoadingComments && (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            )}
            {!isLoadingComments && error && (
              <Typography color="error" className="text-center">{error}</Typography>
            )}
            {!isLoadingComments && !error && comments.length === 0 && (
              <div className="text-center py-10">
                  <MessageCircleIcon size={48} className="mx-auto text-gray-400 mb-2" />
                <Typography className="text-gray-500">No comments yet.</Typography>
                <Typography variant="body2" className="text-gray-400">Be the first to share your thoughts!</Typography>
              </div>
            )}
            {!isLoadingComments && !error && comments.map((comment) => {
              const commenter = getCommenterDetails(comment);
              return (
                <Paper key={comment.commentId} elevation={1} className="p-3 rounded-lg flex items-start space-x-3">
                  <Avatar src={commenter.avatarUrl} alt={commenter.name} sx={{ width: 36, height: 36 }} />
                  <div className="flex-grow">
                    <div className="flex items-baseline space-x-2">
                        <Typography variant="subtitle2" className="font-semibold text-gray-800">
                        {commenter.name}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                        {formatDate(comment.createdAt)}
                        </Typography>
                    </div>
                    <Typography variant="body2" className="text-gray-700 whitespace-pre-wrap break-words">
                      {comment.content}
                    </Typography>
                  </div>
                </Paper>
              );
            })}
            <div ref={commentsEndRef} /> {/* For scrolling to bottom */}
          </div>

          <Paper elevation={2} className="p-3 border-t sticky bottom-0 bg-white">
            <div className="flex items-center space-x-3">
              <Avatar src={currentUser?.avatar || avatarPlaceholder} alt={currentUser?.name || "You"} sx={{ width: 40, height: 40 }} />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                maxRows={3}
                size="small"
                disabled={isPostingComment}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePostComment}
                disabled={isPostingComment || !newComment.trim()}
                size="medium"
                sx={{ borderRadius: '20px', textTransform: 'none', px:3 }}
              >
                {isPostingComment ? <CircularProgress size={20} color="inherit" /> : <SendIcon size={18} />}
              </Button>
            </div>
            {error && !isLoadingComments && <Typography color="error" variant="caption" sx={{display: 'block', mt:1}}>{error}</Typography>}
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentDrawer;