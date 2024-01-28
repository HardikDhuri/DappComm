import axios from "axios";
import Web3 from "web3";

let walletAddress: string | null = null;

if (window.ethereum) {
  const web3 = new Web3(window.ethereum);

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    walletAddress = accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
  }
} else {
  alert("Please download MetaMask");
}

// Replace QueryClient and QueryClientProvider with Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:2140",
  headers: {
    "X-Address": walletAddress ?? "",
  },
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

const registerUser = async (username: string, displayName: string) => {
  try {
    const response = await axiosInstance.post("/register", {
      username,
      displayName,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const sendRequest = async (receiverAddress: string) => {
  try {
    const response = await axiosInstance.post("/send-request", {
      receiver: receiverAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const getUserProfileByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get("/profile", {
      params: {
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

export { sendRequest, getUserProfile, registerUser, getUserProfileByUsername };
