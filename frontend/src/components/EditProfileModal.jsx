import React from "react";
import { FaUserEdit, FaTimes } from "react-icons/fa";

const EditProfileModal = ({
  user,
  username,
  setUsername,
  loading,
  onClose,
  onSubmit,
  error,
}) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        <FaTimes className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 bg-[#5AB1F5]/10 text-[#5AB1F5] rounded-full flex items-center justify-center mb-3">
          <FaUserEdit className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
        <p className="text-sm text-gray-500 mt-1">Update your profile details</p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            value={user.first_name}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-500 border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            value={user.last_name}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-500 border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-500 border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#5AB1F5]`}
          />
          {error && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 mt-1 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#5AB1F5] hover:bg-[#4298dd] text-white font-semibold transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default EditProfileModal;
