// UserCircle.tsx

import React from "react";

interface UserCircleProps {
  user: User;
  sent: boolean;
  areFriends: boolean;
  handleAddFriend: (address: string) => void;
}

const UserCircle: React.FC<UserCircleProps> = ({
  user,
  sent,
  areFriends,
  handleAddFriend,
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0"></div>
      <div className="grow ml-3">
        <p className="text-xl font-bold">{user.displayName}</p>
        <p className="text-gray-500">@{user.username}</p>
      </div>
      <div>
        {areFriends ? (
          <button className="bg-black content-end text-white py-2 px-6 rounded-md mr-4 border border-white">
            Friends👬🏽
          </button>
        ) : !sent && !areFriends ? (
          <button
            className="bg-violet-700 content-end text-white py-2 px-6 rounded-md mr-4 hover:bg-indigo-500"
            onClick={() => handleAddFriend(user.address)}
          >
            Add
          </button>
        ) : (
          <button className=" bg-black content-end text-white py-2 px-6 rounded-md mr-4 border border-white">
            Requested⌛
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCircle;
