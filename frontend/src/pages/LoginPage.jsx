import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser as apiLoginUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const animatedTexts = ['Connect.', 'Share.', 'Create.'];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser, loginUser } = useAuth();

  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (subIndex === animatedTexts[textIndex].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setDisplayedText(animatedTexts[textIndex].substring(0, subIndex));
    }, isDeleting ? 100 : 150);
    return () => clearTimeout(timeout);
  }, [subIndex, textIndex, isDeleting]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await apiLoginUser({ email, password });
      loginUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Failed to log in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-2 bg-gray-50 text-gray-900">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="mt-2 text-gray-500">Welcome back to <span className="font-semibold text-indigo-600">ChitChat</span>.</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Right: Welcome Animation */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 p-12 relative">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-800">
            Welcome to <span className="text-indigo-600">ChitChat</span>
          </h2>
          <div className="mt-6 h-16 text-3xl font-semibold text-gray-700">
            <span>{displayedText}</span>
            <span className="animate-pulse">|</span>
          </div>
        </div>
        <div className="absolute bottom-8 text-center text-gray-600">
          <p>Developed with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
