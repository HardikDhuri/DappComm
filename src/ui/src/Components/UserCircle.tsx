// UserCircle.tsx

import React from "react";

interface UserCircleProps {
  user: User;
}

const UserCircle: React.FC<UserCircleProps> = ({ user }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0"></div>
      <div className="ml-3">
        <p className="text-xl font-bold">{user.displayName}</p>
        <p className="text-gray-500">{user.address}</p>
      </div>
      <button className="bg-primary justify-end p-2 rounded-md hover:bg-green-500 transition duration-300">
        Add Friend
      </button>
    </div>
  );
};

export default UserCircle;
