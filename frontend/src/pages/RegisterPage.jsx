import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/apiService";

const animatedTexts = ["Connect.", "Share.", "Create."];

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Typing animation states
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

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
    }, isDeleting ? 80 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, textIndex, isDeleting]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = await registerUser({ username, email, password });
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Registration failed. The email or username may already be taken.");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="mt-2 text-gray-500">
            Join{" "}
            <span className="font-semibold text-blue-600">ChitChat</span> today.
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-50 border rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-50 border rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-50 border rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Animated Text */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-800">
            Welcome to{" "}
            <span className="text-blue-600">ChitChat</span>
          </h2>
          <div className="mt-4 h-16 text-3xl font-semibold text-gray-600">
            <span>{displayedText}</span>
            <span className="animate-blink">|</span>
          </div>
        </div>

        <div className="absolute bottom-8 text-center text-gray-400 text-sm">
          <p>Developed with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
