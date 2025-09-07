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
      <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0">
        {comment.author?.profilePicture && (
          <img
            src={comment.author.profilePicture}
            alt={comment.author.username}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-white">{comment.author.username}</p>
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
      className="bg-gray-800 rounded-lg shadow-lg m-4 overflow-hidden"
    >
      {/* Post header */}
      <Link
        to={`/profile/${post.author.username}`}
        className="flex items-center p-4"
      >
        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex-shrink-0">
          {authorProfilePic && (
            <img
              src={authorProfilePic}
              alt={post.author.username}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-bold text-white hover:underline">
            {post.author.username}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </Link>

      {/* Post content */}
      <p className="px-4 text-gray-300 whitespace-pre-wrap mb-4">
        {post.content}
      </p>

      {/* Action bar */}
      <div className="flex items-center gap-x-6 text-gray-400 border-t border-gray-700 px-4 py-2">
        <button
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
          className="flex items-center gap-x-2 focus:outline-none"
        >
          {isLiked ? (
            <FaHeart className="text-red-500" size={20} />
          ) : (
            <FaRegHeart className="hover:text-red-500" size={20} />
          )}
          <span>{likeCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-x-2 focus:outline-none"
        >
          <FaRegComment className="hover:text-blue-400" size={20} />
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
            className="px-4 pb-4 border-t border-gray-700"
          >
            {/* Comment form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-x-2 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
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
