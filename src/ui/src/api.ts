import axios from "axios";

// Replace QueryClient and QueryClientProvider with Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:2140", // Replace with your actual API base URL
});

// Function to get user profile using Axios
const getUserProfile = async (address: string) => {
  try {
    const response = await axiosInstance.get(
      `/profilebyaddress?address=${address}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const registerUser = async (
  username: string,
  displayName: string,
  address: string
) => {
  try {
    const response = await axiosInstance.post("/register", {
      username,
      displayName,
      address,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const getUserProfileByUsername = async (address: string, username: string) => {
  try {
    const response = await axiosInstance.get("/profile", {
      params: {
        address: address,
        username: username,
      },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error searching for user:", error);
    return null;
  }
};

export { getUserProfile, registerUser, getUserProfileByUsername };
