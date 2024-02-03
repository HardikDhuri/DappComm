import React, { useEffect, useState } from "react";
import UserCircle from "./UserCircle";
import { getUserProfileByUsername, sendRequest } from "../api";

interface AddFriendProps {
  address: string;
}

const AddFriend: React.FC<AddFriendProps> = ({ address }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [searched, setSearched] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [areFriends] = useState(false);

  const handleAddFriend = async (address: string) => {
    // Add friend logic
    const response = await sendRequest(address);
    console.log(response);
    setRequestSent(true);
  };

  const handleSearch = async (query: string) => {
    const userData = await getUserProfileByUsername(query);
    setFoundUser(userData);
    setSearched(true);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-4">Add Friend</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="w-full text-black border rounded-md mr-3 py-2 px-3"
          placeholder="Enter username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition duration-300"
          onClick={() => handleSearch(searchQuery)}
        >
          Search
        </button>
      </div>

      {/* Display User Component if found */}
      {foundUser?.address === address && <p>That's you!</p>}
      {foundUser && foundUser.address != address && (
        <UserCircle
          handleAddFriend={handleAddFriend}
          areFriends={areFriends}
          sent={requestSent}
          user={foundUser}
        />
      )}
      {searched && !foundUser && <p>No user found</p>}
    </div>
  );
};

export default AddFriend;
