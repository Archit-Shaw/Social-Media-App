import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser as apiLoginUser } from '../services/apiService'; // API function ka naam badla
import { useAuth } from '../context/AuthContext';

const animatedTexts = ['Connect.', 'Share.', 'Create.'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser, loginUser } = useAuth(); // Context se loginUser function liya

  // Agar user pehle se logged in hai, to use homepage par bhej do
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Typing animation ka logic (koi badlaav nahin)
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
      loginUser(userData); // Global state ko update kiya
      navigate('/');
    } catch (error) {
      console.error('Failed to log in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Left Side: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Login</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Welcome back to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Social media</span></p>
            </div>
            <div className="hidden sm:flex items-center justify-center px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30"> 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6" aria-label="login form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-transparent bg-white dark:bg-gray-700/40 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-transparent bg-white dark:bg-gray-700/40 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
                placeholder="Your secure password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300/40 transition-transform"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Animated Welcome Message */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative">
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-8 py-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">Welcome to <span className="text-indigo-200">Social  media</span></h2>
          <div className="mt-6 h-16 text-2xl sm:text-3xl font-semibold">
            <span className="inline-block align-middle">{displayedText}</span>
            <span className="inline-block align-middle ml-2 animate-pulse">|</span>
          </div>
          <p className="mt-4 max-w-md text-sm sm:text-base text-indigo-100/90">Bring your ideas to life — chat, collaborate and create with ease.</p>
        </div>

        <div className="absolute bottom-6 text-center text-sm text-indigo-100/80">
          <p className="leading-tight">Developed with ❤️ India</p>
          <p>
            by{' '}
            <a href="#" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-200">Archit</a>
          </p>
        </div>
      </div>
    </div>
  );
}
