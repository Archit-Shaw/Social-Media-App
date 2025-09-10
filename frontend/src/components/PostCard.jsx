import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  likeUnlikePost,
  getCommentsForPost,
  createComment,
} from '../services/apiService';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Single comment component
const Comment = ({ comment }) => {
  return (
    <div className="flex items-start gap-x-3 mt-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] flex-shrink-0">
        <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden">
          {comment.author?.profilePicture && (
            <img
              src={comment.author.profilePicture}
              alt={comment.author.username}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {comment.author.username}
        </p>
        <p className="text-gray-300">{comment.text}</p>
      </div>
    </div>
  );
};

const PostCard = ({ post, onPostUpdate }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Check if already liked
  useEffect(() => {
    if (currentUser && post.likes.includes(currentUser._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentUser, post.likes]);

  // Handle like
  const handleLike = async () => {
    if (!currentUser) {
      alert('You must be logged in to like a post.');
      return;
    }
    try {
      const updatedPost = await likeUnlikePost(post._id);
      onPostUpdate(updatedPost);
      setLikeCount(updatedPost.likes.length);
      setIsLiked(updatedPost.likes.includes(currentUser._id));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Toggle comments
  const handleToggleComments = async () => {
    const newShow = !showComments;
    setShowComments(newShow);

    if (newShow && comments.length === 0) {
      try {
        const fetchedComments = await getCommentsForPost(post._id);
        setComments(fetchedComments);
        setCommentCount(fetchedComments.length);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    }
  };

  // Submit comment (optimistic update)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const tempComment = {
      _id: `temp-${Date.now()}`,
      text: newComment,
      author: {
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      },
    };

    setComments([tempComment, ...comments]);
    setCommentCount((prev) => prev + 1);
    setNewComment('');

    try {
      const createdComment = await createComment(post._id, newComment);
      setComments((prev) =>
        prev.map((c) => (c._id === tempComment._id ? createdComment : c))
      );
    } catch (error) {
      console.error('Failed to create comment', error);
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
      setCommentCount((prev) => prev - 1);
    }
  };

  const authorProfilePic =
    currentUser && post.author._id === currentUser._id
      ? currentUser.profilePicture
      : post.author.profilePicture;

  return (
    <motion.div
      layout
      className="bg-white/5 backdrop-blur-md border border-white/10 
                 rounded-2xl shadow-lg m-4 overflow-hidden transition 
                 hover:shadow-xl hover:border-white/20"
    >
      {/* Post header */}
      <Link
        to={`/profile/${post.author.username}`}
        className="flex items-center p-4"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] mr-3">
          <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
            {authorProfilePic && (
              <img
                src={authorProfilePic}
                alt={post.author.username}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-white hover:underline">
            {post.author.username}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </Link>

      {/* Post content */}
      <p className="px-4 text-gray-200 whitespace-pre-wrap mb-4 leading-relaxed">
        {post.content}
      </p>

      {/* Action bar */}
      <div className="flex items-center gap-x-6 text-gray-400 border-t border-white/10 px-4 py-2">
        <button
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
          className="flex items-center gap-x-2 focus:outline-none hover:scale-105 transition"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 drop-shadow-md" size={20} />
          ) : (
            <FaRegHeart className="hover:text-red-500" size={20} />
          )}
          <span>{likeCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-x-2 focus:outline-none hover:text-blue-400 hover:scale-105 transition"
        >
          <FaRegComment size={20} />
          <span>{commentCount > 0 ? commentCount : ''}</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 border-t border-white/10"
          >
            {/* Comment form */}
            <form
              onSubmit={handleCommentSubmit}
              className="flex gap-x-2 mt-4 items-center"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-gray-900/80 border border-gray-700 
                           rounded-full text-white focus:outline-none 
                           focus:border-blue-500 transition"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-full font-semibold 
                           hover:from-blue-500 hover:to-purple-500 transition"
              >
                Post
              </button>
            </form>

            {/* Comment list */}
            {comments.map((comment) => (
              <Comment key={comment._id || comment.tempId} comment={comment} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
