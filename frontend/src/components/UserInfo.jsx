import React, { useState, useRef } from "react";
import { FaUserEdit, FaKey } from "react-icons/fa";
import ProfileTrips from "./ProfileTrips";
import ProfileFavorites from "./ProfileFavorites";
import useUserTrips from "../hooks/useUserTrips";
import useUserFavorites from "../hooks/useUserFavorites";
import useUpdateUsername from "../hooks/useUpdateUsername";
import useChangePassword from "../hooks/useChangePassword";
import { successToast, errorToast } from "../../utils/toastUtil";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const UserInfo = ({ user, initials }) => {
  const [activeTab, setActiveTab] = useState("trips");
  const [editProfile, setEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { trips } = useUserTrips(user.id);
  const { favorites } = useUserFavorites(user.id);
  const { updateUsername, loading } = useUpdateUsername();
  const { changePassword: changePasswordApi, loading: passwordLoading } =
    useChangePassword();

  // Ref for the content section
  const contentRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameError("");
    try {
      const ok = await updateUsername(user.id, username);
      if (ok === true) {
        successToast("Username updated!");
        localStorage.setItem("user", JSON.stringify({ ...user, username }));
        setEditProfile(false);
      } else if (typeof ok === "string") {
        setUsernameError(ok);
      } else {
        errorToast("Failed to update username");
      }
    } catch (err) {
      setUsernameError("Failed to update username");
    }
  };

  // Change password handler
  const handleChangePassword = async ({ current, next, confirm }) => {
    setPasswordError("");
    if (next !== confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    const result = await changePasswordApi({
      userId: user.id,
      currentPassword: current,
      newPassword: next,
    });
    if (result.success) {
      successToast("Password changed successfully!");
      setChangePassword(false);
    } else {
      setPasswordError(result.error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Profile Header Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center mb-10">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-[#5AB1F5] text-white text-4xl font-bold flex items-center justify-center mb-4 shadow-inner">
          {initials}
        </div>

        {/* Name + Email */}
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-gray-500 text-sm">{user.email}</p>

        {/* Edit & Change Password Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium flex items-center gap-2 transition"
            onClick={() => setEditProfile(true)}
          >
            <FaUserEdit className="text-gray-500" />
            Edit Profile
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium flex items-center gap-2 transition"
            onClick={() => setChangePassword(true)}
          >
            <FaKey className="text-gray-500" />
            Change Password
          </button>
        </div>

        {/* Tabs Inside Card */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => handleTabClick("trips")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === "trips"
                ? "bg-[#5AB1F5] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Trips
          </button>
          <button
            onClick={() => handleTabClick("favorites")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === "favorites"
                ? "bg-[#5AB1F5] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="w-full max-w-5xl px-4" ref={contentRef}>
        <div className="rounded-xl bg-white shadow p-6">
          {activeTab === "trips" ? (
            <ProfileTrips trips={trips} />
          ) : (
            <ProfileFavorites favorites={favorites} />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editProfile && (
        <EditProfileModal
          user={user}
          username={username}
          setUsername={setUsername}
          loading={loading}
          onClose={() => {
            setEditProfile(false);
            setUsernameError("");
          }}
          onSubmit={handleUsernameUpdate}
          error={usernameError}
        />
      )}

      {/* Change Password Modal */}
      {changePassword && (
        <ChangePasswordModal
          loading={passwordLoading}
          onClose={() => {
            setChangePassword(false);
            setPasswordError("");
          }}
          onSubmit={handleChangePassword}
          error={passwordError}
        />
      )}
    </div>
  );
};

export default UserInfo;
