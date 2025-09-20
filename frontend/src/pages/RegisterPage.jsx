import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const animatedTexts = ['Connect.', 'Share.', 'Create.'];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Typing animation states
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (subIndex === animatedTexts[textIndex].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 800);
    } else if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setDisplayedText(animatedTexts[textIndex].substring(0, subIndex));
    }, isDeleting ? 60 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, textIndex, isDeleting]);

  // Simple password strength scoring
  const passwordScore = (pw) => {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score; // 0-4
  };

  const score = passwordScore(password);
  const strengthText = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong'][score];
  const strengthWidth = `${(score / 4) * 100}%`;

  const validate = () => {
    if (!username.trim()) return 'Username is required.';
    if (!email.trim()) return 'Email is required.';
    // basic email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email.';
    if (password.length < 6) return 'Password should be at least 6 characters.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const userData = await registerUser({ username, email, password });
      localStorage.setItem('userInfo', JSON.stringify(userData));
      navigate('/');
    } catch (err) {
      console.error('Failed to register:', err);
      setError(err?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-12">
        {/* Form panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Create an account</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join <span className="font-semibold text-indigo-600 dark:text-indigo-400">Social media</span> — it only takes a minute.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h5v4H4v9H3a1 1 0 01-1-1V5z"/></svg>
                <span className="text-xs text-indigo-700 dark:text-indigo-200">Fast signup</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4" aria-label="register form">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="yourname"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Create a secure password"
                    required
                    aria-describedby="pw-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div id="pw-help" className="mt-2">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" style={{ width: strengthWidth }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Strength: <span className="font-medium">{strengthText}</span></p>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-indigo-300/40 transition"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>By signing up you agree to our <a href="#" className="underline">Terms</a></span>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Log in</Link>
              </div>
            </form>

            {/* <div className="mt-4 text-center text-sm text-gray-500">Or continue with</div> */}
            {/* <div className="mt-3 grid grid-cols-3 gap-3">
               <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 flex items-center justify-center text-sm hover:shadow sm:text-xs">Google</button>
              <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 flex items-center justify-center text-sm hover:shadow sm:text-xs">Github</button>
              <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 flex items-center justify-center text-sm hover:shadow sm:text-xs">Twitter</button> 
            </div>  */}
          </div>
        </div>

        {/* Right panel: hero / animated text */}
        <aside className="hidden md:flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">Welcome to <span className="text-indigo-200">Social media</span></h2>
          <div className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight h-12 flex items-center">
            <span className="min-w-[8ch] text-left">{displayedText}</span>
            <span className="ml-2 animate-pulse">|</span>
          </div>

          <p className="mt-4 max-w-xs text-sm text-indigo-100/90 text-center">Chat, collaborate and create — built for teams and creators.</p>

          <div className="mt-8 text-sm text-indigo-100/80 text-center">
            <p>Developed with ❤️ in India</p>
            <p className="mt-1 text-xs">Crafted by Archit & team</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
