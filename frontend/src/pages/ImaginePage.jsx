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
        <h1 className="text-xl font-bold text-gray-800">Designer</h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-3xl mx-auto">
        {/* Form */}
        <form
          onSubmit={handleGenerate}
          className="flex flex-col sm:flex-row gap-2 mb-6"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to generate an image..."
            className="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Image Preview */}
        <div className="flex justify-center items-center bg-white rounded-lg shadow-md min-h-[512px] border border-gray-200">
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
                className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImaginePage;
