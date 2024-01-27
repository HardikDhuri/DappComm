import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface HomeProps {
  user: User | null; // Assuming User is a type representing user data
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      return navigate("/signin");
    }
  }, [user]);

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
