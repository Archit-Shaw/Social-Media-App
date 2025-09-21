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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Designer ✨</h1>
      </header>

      <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
        {/* Using responsive grid: mobile=single col, md=two col, lg=2 col with wider gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Card */}
          <form
            onSubmit={handleGenerate}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col gap-3"
            aria-label="image generation form"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Enter your prompt</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Be descriptive — include style, mood, colors, and references.</p>
              </div>

              <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/30">
                  <FaImage />
                  <span>Image AI</span>
                </span>
              </div>
            </div>

            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to see... e.g. 'A cozy reading nook by a rain-soaked window, warm lamplight, oil painting'"
              rows={6}
              className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm text-sm sm:text-base"
            />

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:scale-[0.995] active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 transition w-full sm:w-auto"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate Image</span>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setPrompt("");
                    setError("");
                  }}
                  className="px-4 py-3 w-full sm:w-auto rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  Clear
                </button>

                <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Tip: add camera, lens or art style for better results</div>
              </div>
            </div>

            {/* Mobile hint row */}
            <div className="mt-1 sm:hidden text-xs text-gray-500">Tip: add camera, lens or art style for better results</div>
          </form>

          {/* Image Preview Card */}
          <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center justify-center min-h-[360px] md:min-h-[420px]">
            <div className="w-full h-full flex items-center justify-center">
              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center gap-3">
                  <FaSpinner className="text-indigo-600 dark:text-indigo-300 text-4xl animate-spin" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Generating your image — processing...</p>
                </div>
              )}

              {/* Image Loaded */}
              {imageUrl && !loading && (
                <div className="relative w-full max-w-full">
                  {/* Container ensures the image scales responsively and is scrollable on very small screens */}
                  <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center rounded-xl">
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="rounded-xl w-full h-auto max-h-[640px] object-contain shadow-lg"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>

                  {/* Top-right download (visible on hover for md+ and always accessible via floating action) */}
                  <div className="absolute top-4 right-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      title="Download image"
                    >
                      <FaDownload />
                      <span className="text-sm hidden md:inline">Download</span>
                    </button>
                  </div>

                  {/* Floating action for quick download (visible on all sizes) */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label="Download generated image"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !imageUrl && (
                <div className="flex flex-col items-center gap-3 text-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                  </svg>
                  <p className="text-lg">Your generated image will appear here 👇</p>
                  <p className="text-sm text-gray-500">Use a descriptive prompt and tap <span className="font-semibold">Generate Image</span>.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">Images are generated using AI — results may vary.</div>
      </main>
    </div>
  );
}
