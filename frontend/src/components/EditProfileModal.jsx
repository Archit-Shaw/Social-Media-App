import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { updateUserProfile } from "../services/apiService";

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [bio, setBio] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }

    try {
      const updatedProfile = await updateUserProfile(formData);
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Could not update profile.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl"></div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✨ Edit Profile
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex items-center gap-x-6">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-4 border-blue-100 shadow-lg">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                             file:rounded-xl file:border-0 
                             file:text-sm file:font-semibold 
                             file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 
                             file:text-white hover:file:opacity-90 cursor-pointer"
                />
              </div>

              {/* Bio Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-28 p-3 bg-gray-50 border border-gray-200 rounded-xl 
                             text-gray-800 shadow-sm focus:outline-none focus:ring-2 
                             focus:ring-blue-400 transition"
                  placeholder="Write something about yourself..."
                ></textarea>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                             text-white font-semibold shadow-md hover:shadow-lg 
                             hover:scale-105 transition-transform"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
