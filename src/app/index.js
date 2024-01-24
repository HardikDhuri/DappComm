const express = require("express");
const { Web3 } = require("web3");
const URContract = require("./build/contracts/UserRegistery.json");

const app = express();

app.use(express.json());

const port = 2140;

const ethereumNodeEndpoint = "http://localhost:8545";
const contractAddress = "0x50769DfF329d4ff57ef748d6f5585b11e867cfa2";

const web3 = new Web3(ethereumNodeEndpoint);

const contractAbi = URContract.abi;

// Connect to the smart contract using the ABI and contract address
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, displayName } = req.body;
    const userAddress = "0xF097051832E8958878155d49eF269ae8daF91106"; // Replace with the actual user's Ethereum address
    const privateKey =
      "0x6cca051f08b8419c0198d93828e1bd3cfee9b79d5968bdc6c31441c8404d3161"; // Replace with the user's private key

    // Create a transaction object
    const txObject = contract.methods.registerUser(username, displayName);

    // Estimate gas cost
    const gasEstimate = await txObject.estimateGas({ from: userAddress });

    // Build the raw transaction
    const rawTx = {
      from: userAddress,
      to: contractAddress,
      gas: gasEstimate,
      data: txObject.encodeABI(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(userAddress),
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({
      success: true,
      message: "User registered successfully",
      receipt,
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
    const userAddress = "USER_ADDRESS";
    const userProfile = await contract.methods.users(userAddress).call();

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
