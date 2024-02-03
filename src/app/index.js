const express = require("express");
var cors = require("cors");
const { Web3 } = require("web3");
const UserRegisteryContractJson = require("./build/contracts/UserRegistery.json");
const UserRelationsContractJson = require("./build/contracts/UserRelationshipManager.json");

require("dotenv").config();

const ganacheUrl = process.env.GANACHE_URL;
const userRegisteryAddress = process.env.CONTRACT_ADDRESS;
const userRelationsAddress = process.env.USER_RELATIONSHIP_MANAGER_ADDRESS;
const privateKey2 = process.env.PRIVATE_KEY2;
const FRMContractAddress = process.env.FRIEND_REGISTRY_ADDRESS;

const app = express();

let userCount = 0;

app.use(express.json());
app.use(cors());

const port = 2140;

// Connect to the Ethereum network using the HTTP provider
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider);

// Connect to the smart contract using the ABI and contract address
const userRegisteryContract = new web3.eth.Contract(
  UserRegisteryContractJson.abi,
  userRegisteryAddress
);
userRegisteryContract.options = {
  address: userRegisteryAddress,
  from: userRegisteryAddress,
  gasPrice: "10000000000000",
  gas: 1000000,
};

const userRelationsContract = new web3.eth.Contract(
  UserRelationsContractJson.abi,
  userRelationsAddress
);
userRelationsContract.options = {
  address: userRelationsAddress,
  from: userRelationsAddress,
  gasPrice: "10000000000000",
  gas: 1000000,
};

const userRegisteredEvent = userRegisteryContract.events.UserRegistered();

userRegisteredEvent.on("data", (data) => {
  console.log(data);
});

userRegisteredEvent.on("error", (err) => {
  console.log(err);
});

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, displayName } = req.body;
    const address = req.headers["x-address"];

    // Create a transaction object
    const receipt = await userRegisteryContract.methods
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
    const message =
      error.innerError.message.split("revert")[1]?.trim() ??
      error.innerError.message;
    res.status(500).json({ success: false, message: message });
  }
});

// Endpoint to get user profile
app.get("/profile-by-username", async (req, res) => {
  try {
    const { username } = req.query;
    const address = req.headers["x-address"];
    // Make sure to replace 'USER_ADDRESS' with the user's Ethereum address
    const userProfile = await userRegisteryContract.methods
      .getUserProfile(username)
      .call({ from: address });

    if (userProfile[0] === "0x0000000000000000000000000000000000000000") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        address: userProfile[0],
        username: userProfile[1],
        displayName: userProfile[2],
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
app.get("/profile-by-address", async (req, res) => {
  try {
    const { address } = req.query;
    const senderAddress = req.headers["x-address"];

    const userProfile = await userRegisteryContract.methods
      .getUserProfileByAddress(address)
      .call({ from: senderAddress });

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
    const { receiver } = req.body;
    const senderAddress = req.headers["x-address"];
    // const receipt = await userRelationsContract.methods
    //   .sendFriendRequest(receiverId)
    //   .send({ from: senderAddress });

    console.log("Success");

    res.json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send request" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
