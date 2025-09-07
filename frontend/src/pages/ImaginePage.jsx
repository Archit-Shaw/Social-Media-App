import React, { useState } from "react";
import { generateImage } from "../services/apiService";
import { FaDownload, FaSpinner } from "react-icons/fa";

const ImaginePage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setImageUrl(null);
    setError("");
    try {
      const imageBlob = await generateImage(prompt);
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "chitchat-imagine.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Designer ✨
        </h1>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Form Card */}
        <form
          onSubmit={handleGenerate}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
        >
          <label className="block text-gray-700 font-semibold mb-2">
            Enter your prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to see..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          )}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </form>

        {/* Image Preview Card */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex justify-center items-center min-h-[512px]">
          {loading && (
            <FaSpinner className="text-blue-600 text-4xl animate-spin" />
          )}
          {imageUrl && (
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Generated"
                className="rounded-lg max-w-full h-auto shadow"
              />
              <button
                onClick={handleDownload}
                className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <FaDownload />
              </button>
            </div>
          )}
          {!loading && !imageUrl && (
            <p className="text-gray-400 text-lg">
              Your generated image will appear here 👇
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImaginePage;
