import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 flex">
        {/* Friends List */}
        {/* Online Friends List */}
        <div className="w-1/4 bg-primary p-4">
          <h2 className="text-white text-2xl font-bold mb-4">Friends</h2>
          {/* Display OnlineFriendsList Component */}
          {/* <OnlineFriendsList /> */}
        </div>
        {/* Chat Section */}
        <div className="flex-1 pl-4">
          {/* Render the child route components */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
