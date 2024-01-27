// AddFriend.tsx

import React, { useState } from "react";
import UserCircle from "./UserCircle";

const AddFriend: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser] = useState<string | null>(null);

  const handleSearch = () => {
    // Perform the search logic here and set the found user
    // Example: setFoundUser(searchQuery);
  };

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
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Display User Component if found */}
      {foundUser && <UserCircle displayName="John Doe" username={foundUser} />}
    </div>
  );
};

export default AddFriend;
