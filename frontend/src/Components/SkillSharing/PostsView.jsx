import React, { useState } from 'react'
import { ThumbsUp, MessageCircle, Bookmark, MoreVertical, Hand, Heart, Lightbulb, Laugh, HandHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// For later: import { Menu, MenuItem, CircularProgress, Avatar } from '@mui/material';

// Define category colors (can be imported from a shared constants file too)
const categoryColors = {
  Technology: 'bg-sky-100 text-sky-700',
  Science: 'bg-green-100 text-green-700',
  Art: 'bg-purple-100 text-purple-700',
  Music: 'bg-pink-100 text-pink-700',
  Sports: 'bg-orange-100 text-orange-700',
  Education: 'bg-amber-100 text-amber-700',
  Other: 'bg-slate-100 text-slate-700',
  default: 'bg-gray-100 text-gray-700',
};

// API_BASE_URL is not strictly needed here if backend sends full URLs for media
// const API_BASE_URL = 'http://localhost:8080'; 

// Props it will receive:
// - posts: Array of post objects to display
// - loading: Boolean to show loading state
// - error: String to show error message
// - onEditPost: (optional) function to handle editing a post
// - onDeletePost: (optional) function to handle deleting a post
// - onReactToPost: (optional) function to handle reactions
// - onCommentOnPost: (optional) function to handle comments
// - onSavePost: (optional) function to handle saving/unsaving
// - currentUser: (optional) object for checking ownership for edit/delete

// Updated reactionEmojis to better match common reactions and ensure icons are distinct
const reactionEmojis = [
  { icon: <ThumbsUp className="w-7 h-7 text-blue-600" />, label: 'Like' },
  { icon: <HandHeart className="w-7 h-7 text-red-600" />, label: 'Love' }, // Common alternative to Heart for Love reaction
  { icon: <Laugh className="w-7 h-7 text-yellow-500" />, label: 'Haha' },
  { icon: <Hand className="w-7 h-7 text-green-600" />, label: 'Support' }, // Common for support/celebrate
  { icon: <Lightbulb className="w-7 h-7 text-purple-600" />, label: 'Insightful' }, 
  // Add more or adjust as per your Posts.jsx version
];

function PostsView({ 
    posts = [], 
    loading = false, 
    error = null,
    showAuthorInfo = true,
    currentUserId = null, // ID of the logged-in user
    onOpenMenu,         // Function to call when MoreVertical is clicked: (event, postId) => {}
    mediaMaxHeight = 'max-h-[500px]' // New prop
}) {
  const [likePopupIdx, setLikePopupIdx] = useState(null);

  if (loading) {
    return <div className="text-center py-10"><p>Loading posts...</p></div>; // Replace with CircularProgress if Material UI is used here
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts to display.</div>;
  }

  // Simplified function to get profile image URL - assuming relative path from DB for user profile images
  // This might need to be passed in or handled by a global utility if UserDTO.profileImage format varies.
  const getUserProfileImageUrl = (profileImagePath) => {
    if (!profileImagePath) return 'https://via.placeholder.com/150?text=User';
    // Assuming profileImagePath for user avatars is relative like "profile-images/user-X.jpg"
    // and needs the API_BASE_URL prepended.
    const API_BASE_URL_FOR_PROFILE_IMAGES = 'http://localhost:8080'; // Define explicitly if needed
    const cleanPath = profileImagePath.replace(/^\/api\/media\/files\//, '').replace(/^\/+/, '');
    return `${API_BASE_URL_FOR_PROFILE_IMAGES}/api/media/files/${cleanPath}`;
  };

  return (
    <div className="space-y-6"> 
      {posts.map((post, mapIndex) => {
        const hasMedia = post.mediaList && post.mediaList.length > 0;
        const isMultiMedia = hasMedia && post.mediaList.length > 1;
        const postAuthor = post.user; // Assuming post object has a 'user' field { userId, name, profileImage }
                                     // This needs to be populated by the backend in PostDTO
        const isAuthor = currentUserId && post.userId === currentUserId; // Check if current user is the author of THIS post
        const uniquePopupId = post.postId || mapIndex; // Prefer postId, fallback to mapIndex

        const userAvatarUrl = postAuthor?.profileImage 
          ? getUserProfileImageUrl(postAuthor.profileImage)
          : 'https://via.placeholder.com/150?text=User';

        return (
          <div
            key={post.postId || mapIndex}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 md:p-6 transition-shadow hover:shadow-xl group flex flex-col gap-3.5 relative"
          >
            {/* Post Header: Author, Timestamp, Options Menu */} 
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {showAuthorInfo && postAuthor && (
                  <img 
                    src={userAvatarUrl}
                    alt={postAuthor.name || 'User'} 
                    className="w-11 h-11 rounded-full object-cover border border-gray-300"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=U'} // Simpler fallback
                  />
                )}
                <div>
                  {showAuthorInfo && postAuthor && (
                    <div className="font-semibold text-gray-800 text-base leading-tight">{postAuthor.name || 'Unknown User'}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(post.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              {isAuthor && onOpenMenu && (
                <button 
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-1.5 -mr-1.5 -mt-1" 
                  onClick={(e) => onOpenMenu(e, post.postId)}
                >
                  <MoreVertical size={22} />
                </button>
              )}
            </div>

            {/* Post Content: Title, Text, Category */} 
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 leading-snug">{post.title}</h3>
                <p className="text-gray-700 text-base leading-relaxed break-words whitespace-pre-line">{post.content}</p>
                <div className="flex items-center gap-2 pt-1">
                    <span 
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryColors[post.category] || categoryColors.default}`}
                    >
                        {post.category}
                    </span>
                    {/* Hashtags */} 
                    {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {post.hashtags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="text-xs text-blue-600 hover:underline cursor-pointer">
                            #{typeof tag === 'string' ? tag : tag.name} {/* Adapt based on hashtag object structure */}
                            </span>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Media Section */} 
            {hasMedia && (
              <div className={`mt-3 -mx-5 md:-mx-6 rounded-b-xl overflow-hidden`}> {/* Card edge-to-edge for media */}
                {/* Single main media item */} 
                <div className={isMultiMedia ? 'mb-1' : ''}>
                  {post.mediaList[0].mediaType === 'VIDEO' ? (
                    <video
                      src={post.mediaList[0].mediaUrl}
                      controls
                      className={`w-full ${mediaMaxHeight} object-contain bg-black rounded-t-lg md:rounded-t-xl`} 
                    />
                  ) : (
                    <img
                      src={post.mediaList[0].mediaUrl}
                      alt={`${post.title} - media`}
                      className={`w-full ${mediaMaxHeight} object-contain bg-gray-100 rounded-t-lg md:rounded-t-xl`} 
                    />
                  )}
                </div>
                {/* Thumbnail grid for additional media */} 
                {isMultiMedia && post.mediaList.length > 1 && (
                  <div className={`grid grid-cols-${Math.min(post.mediaList.length -1, 4)} gap-1 px-0.5 pb-0.5`}>
                    {post.mediaList.slice(1).map((mediaItem, mediaIdx) => (
                      <div key={mediaIdx} className="aspect-w-1 aspect-h-1 bg-gray-200">
                        {mediaItem.mediaType === 'VIDEO' ? (
                          <video
                            src={mediaItem.mediaUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={mediaItem.mediaUrl}
                            alt={`${post.title} - media ${mediaIdx + 2}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Actions Bar (Like, Comment, Save) - Basic structure */}
            <div className="flex justify-around items-center border-t border-gray-200 pt-3 mt-auto text-gray-600 font-medium">
              <div className="relative"> {/* Wrapper for Like button and its popup */}
                <button 
                  className="flex items-center gap-1.5 hover:text-blue-600 transition rounded-md px-3 py-1.5 hover:bg-blue-50"
                  onMouseEnter={() => setLikePopupIdx(uniquePopupId)} 
                  onMouseLeave={() => setTimeout(() => { if (likePopupIdx === uniquePopupId) setLikePopupIdx(null); }, 300)}
                >
                  <ThumbsUp size={18} /> Like
                </button>
                <AnimatePresence>
                  {likePopupIdx === uniquePopupId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 25, duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-30 flex gap-0.5 bg-white rounded-full shadow-xl p-1 border border-gray-200"
                      onMouseEnter={() => setLikePopupIdx(uniquePopupId)} 
                      onMouseLeave={() => setLikePopupIdx(null)} 
                    >
                      {reactionEmojis.map((reaction, rIdx) => (
                        <motion.div
                          key={rIdx}
                          className="p-1.5 rounded-full hover:bg-gray-200 cursor-pointer group/emoji"
                          whileHover={{ scale: 1.20, y: -2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          // onClick={() => onReactToPost && onReactToPost(post.postId, reaction.name)} // TODO: Implement actual reaction logic
                        >
                          {React.cloneElement(reaction.icon, { className: `${reaction.icon.props.className} transition-transform duration-150 ease-in-out group-hover/emoji:scale-110` })}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="flex items-center gap-1.5 hover:text-green-600 transition rounded-md px-3 py-1.5 hover:bg-green-50">
                <MessageCircle size={18} /> Comment
              </button>
              <button className="flex items-center gap-1.5 hover:text-purple-600 transition rounded-md px-3 py-1.5 hover:bg-purple-50">
                <Bookmark size={18} /> Save
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PostsView
