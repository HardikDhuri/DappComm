const express = require("express");
var cors = require("cors");
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
app.use(cors());

const port = 2140;

// Connect to the Ethereum network using the HTTP provider
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider, privateKey2);

// Connect to the smart contract using the ABI and contract address
const contract = new web3.eth.Contract(URContract.abi, contractAddress);
contract.options = {
  address: contractAddress,
  from: contractAddress,
  gasPrice: "10000000000000",
  gas: 1000000,
};

const frmContract = new web3.eth.Contract(
  FRMContractJson.abi,
  FRMContractAddress
);
frmContract.options = {
  address: FRMContractAddress,
  gas: 1000000,
};

app.get("/get_ether_details", function (req, res) {
  var respo = {
    version: web3.version,
    // "balance1":balance
  };
  res.json(respo);
});

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, displayName, address } = req.body;

    // Create a transaction object
    const receipt = await contract.methods
      .registerUser(username, displayName)
      .send({ from: address });

    // Convert BigInt values to strings in the receipt
    const receiptString = JSON.stringify(receipt, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    const { message } = JSON.parse(receiptString);

    res.status(201).json({
      success: true,
      message: message,
    });
  } catch (error) {
    const message = error.innerError.message.split("revert")[1].trim();
    res.status(500).json({ success: false, message: message });
  }
});

// Endpoint to get user profile
app.get("/profile", async (req, res) => {
  try {
    const { address, username } = req.query;
    // Make sure to replace 'USER_ADDRESS' with the user's Ethereum address
    const userProfile = await contract.methods
      .getUserProfile(username)
      .call({ from: address });

    res.status(200).json({
      success: true,
      data: {
        username: userProfile[0],
        displayName: userProfile[1],
        address: userProfile[2],
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
});

// Endpoint to get user profile
app.get("/profilebyaddress", async (req, res) => {
  try {
    const { address } = req.query;
    // Make sure to replace 'USER_ADDRESS' with the user's Ethereum address
    const userProfile = await contract.methods
      .getUserProfileByAddress(address)
      .call({ from: userAddress2 });

    uName = userProfile[0];
    displayName = userProfile[1];

    res.status(200).json({
      success: true,
      data: { username: uName, displayName: displayName },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
});

// Endpoint to sent friend request
app.post("/send-request", async (req, res) => {
  try {
    const { receiverId } = req.body;

    const receipt = await frmContract.methods
      .sendFriendRequest(receiverId)
      .send({ from: userAddress2 });

    // Convert BigInt values to strings in the receipt
    const receiptString = JSON.stringify(receipt, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.json({
      success: true,
      message: "Friend request sent successfully",
      receipt: JSON.parse(receiptString), // Parse the string back to JSON
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send request" });
  }
});

// Endpoint to get incoming friend requests for a specific user
app.get("/friend-requests/incoming", async (req, res) => {
  try {
    // Get incoming friend requests for the user
    const ifrequests = await frmContract.methods
      .getIncomingFriendRequests()
      .call({ from: userAddress2 });

    const ifrequestsJson = JSON.stringify(ifrequests, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString(); // Convert string representation of a number to BigInt
      }
      return value; // Return unchanged for other types
    });

    res.json({ success: true, data: ifrequestsJson });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch incoming friend requests",
    });
  }
});

// Endpoint to get incoming friend requests for a specific user
app.get("/friend-requests/outgoing", async (req, res) => {
  try {
    // Get incoming friend requests for the user
    const ofrquests = await frmContract.methods
      .getOutgoingFriendRequests()
      .call({ from: userAddress2 });
    const requests = [];

    ofrquests.forEach((request) => {
      const requestJson = JSON.stringify(request, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString(); // Convert string representation of a number to BigInt
        }
        return value; // Return unchanged for other types
      });
      requests.push(requestJson);
    });

    res.json({ success: true, data: JSON.parse(requests) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch outgoing friend requests",
    });
  }
});

// Endpoint to get users
app.get("/users", async (req, res) => {
  try {
    const users = await contract.methods
      .getAllUserAddresses()
      .call({ from: userAddress2 });

    res.json({ success: true, data: users });
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
