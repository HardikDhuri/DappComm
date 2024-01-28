import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { getUserProfile, registerUser } from "../api";
import { Navigate, useNavigate } from "react-router-dom";

interface SignInProps {
  user: User | null;
  address: string;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const SignIn: FC<SignInProps> = ({
  setUser,
  address: currentUserAddress,
  user,
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(currentUserAddress);
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [currentUserAddress]);

  if (currentUserAddress && user?.username && user?.displayName) {
    return <Navigate to="/chat" />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, displayName);
      if (data.success) {
        const { username, displayName, address } = await getUserProfile(
          currentUserAddress
        );
        setUser({ username, displayName, address });
        navigate("/chat");
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left half on desktop */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">DappComm</h1>
          {/* Add your image logo here */}
          {/* <img src="logo.png" alt="DappComm Logo" className="w-16 h-16 mb-4" /> */}
          <p className="text-xl text-white">
            Your blockchain-powered social media
          </p>
        </div>
      </div>

      {/* Right half on desktop, full on small screens */}
      <div className="w-full md:w-1/2 bg-background p-8">
        <div className="md:hidden text-center mb-8">
          {/* DappComm logo on top for small screens */}
          {/* <img src="logo.png" alt="DappComm Logo" className="w-16 h-16 mb-4 mx-auto" /> */}
          <h1 className="text-2xl font-bold">DappComm</h1>
        </div>

        {/* Sign In form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-md py-2 px-3 text-gray-800 bg-white"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="displayName"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border rounded-md py-2 px-3 text-gray-800 bg-white"
                placeholder="Enter your display name"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
