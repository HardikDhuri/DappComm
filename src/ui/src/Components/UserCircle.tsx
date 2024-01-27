// UserCircle.tsx

import React from "react";

interface UserCircleProps {
  displayName: string;
  username: string;
}

const UserCircle: React.FC<UserCircleProps> = ({ displayName, username }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0"></div>
      <div className="ml-3">
        <p className="text-xl font-bold">{displayName}</p>
        <p className="text-gray-500">{username}</p>
      </div>
    </div>
  );
};

export default UserCircle;
