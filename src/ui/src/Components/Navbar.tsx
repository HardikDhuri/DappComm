import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="bg-primary p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Add your logo here */}
          {/* <img src="logo.png" alt="DappComm Logo" className="w-10 h-10 mr-2" /> */}
          <span className="text-white text-xl font-bold">DappComm</span>
        </div>
        <div className="flex items-center">
          <button className="text-white mr-4 hover:underline ">
            <Link to="/chat">Chat</Link>
          </button>
          <button className="text-white mr-4 hover:underline">
            <Link to="/addfriend">Add Friend</Link>
          </button>
          <button className="text-white mr-4 hover:underline">
            <Link to="notifications">Notifications</Link>
          </button>
          {/* Add other navigation buttons here */}
          <button className="text-white hover:underline">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
