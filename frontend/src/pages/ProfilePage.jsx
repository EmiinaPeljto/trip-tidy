import React from "react";
import UserInfo from "../components/UserInfo";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = (user.first_name?.[0] || "") + (user.last_name?.[0] || "");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <UserInfo user={user} initials={initials.toUpperCase()} />
    </div>
  );
};

export default ProfilePage;
