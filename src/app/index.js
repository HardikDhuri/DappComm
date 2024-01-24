const express = require("express");
const { Web3 } = require("web3");
const URContract = require("./build/contracts/UserRegistery.json");

const app = express();
const userAddress = "0x9544e516348a5818cF4c900C0c57A085d576585B"; // Replace with the actual user's Ethereum address

app.use(express.json());

const port = 2140;

const ethereumNodeEndpoint = "http://localhost:7545";

const contractAddress = "0x50769DfF329d4ff57ef748d6f5585b11e867cfa2";

const privateKey =
  "0xbe05d1981bbb46b29b450604b825650a196103b5292062ddeaa8f0a371d3d7aa"; // Replace with the user's private key

const provider = new Provider(privateKey, ethereumNodeEndpoint);

const web3 = new Web3(provider);
const networkId = await web3.eth.net.getId();

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
