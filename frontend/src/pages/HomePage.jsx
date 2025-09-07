import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPosts } from "../services/apiService";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/create") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleUpdatePost = (updatedPostFromApi) => {
    setPosts(
      posts.map((p) =>
        p._id === updatedPostFromApi._id
          ? { ...updatedPostFromApi, author: p.author }
          : p
      )
    );
  };

  const handlePostCreated = (newPost) => {
    const postWithAuthor = {
      ...newPost,
      author: {
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      },
    };
    setPosts([postWithAuthor, ...posts]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg shadow-sm">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostCreated={handlePostCreated}
      />

      <div className="max-w-2xl mx-auto py-6 px-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 p-6 bg-white rounded-xl shadow">
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="mb-6">
              <PostCard
                post={post}
                currentUser={currentUser}
                onPostUpdate={handleUpdatePost}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
