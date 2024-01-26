const express = require("express");
const { Web3 } = require("web3");
const URContract = require("./build/contracts/UserRegistery.json");
const FRMContractJson = require("./build/contracts/FriendRequestManager.json");

require("dotenv").config();

const ganacheUrl = process.env.GANACHE_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const userAddress = process.env.USER_ADDRESS1;
const userAddress2 = process.env.USER_ADDRESS2;
const privateKey = process.env.PRIVATE_KEY;
const privateKey2 = process.env.PRIVATE_KEY2;
const FRMContractAddress = process.env.FRIEND_REGISTRY_ADDRESS;

const app = express();

app.use(express.json());

const port = 2140;

// Connect to the Ethereum network using the HTTP provider
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider, privateKey2);

// Connect to the smart contract using the ABI and contract address
const contract = new web3.eth.Contract(URContract.abi, networkId);

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, displayName } = req.body;

    // Create a transaction object
    const receipt = await contract.methods
      .registerUser(username, displayName)
      .send({ from: userAddress });

    // Convert BigInt values to strings in the receipt
    const receiptString = JSON.stringify(receipt, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.json({
      success: true,
      message: "User registered successfully",
      receipt: JSON.parse(receiptString), // Parse the string back to JSON
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
});

// Endpoint to get user profile
app.get("/profile", async (req, res) => {
  try {
    // Make sure to replace 'USER_ADDRESS' with the user's Ethereum address
    const userProfile = await contract.methods.getUserProfile.call();

    res.json({ success: true, data: userProfile });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
