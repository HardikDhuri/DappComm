const express = require('express');
const web3 = require('./web3Config.ts');

const app = express();
const port = 3000;

const ethereumNodeEndpoint = 'http://localhost:8545';
const contractAddress = '0x50769DfF329d4ff57ef748d6f5585b11e867cfa2';

// ABI (Application Binary Interface) of your smart contract
const contractAbi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "displayName",
          "type": "string"
        }
      ],
      "name": "UserRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "displayName",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_displayName",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUserProfile",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllUserAddresses",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

// Connect to the smart contract using the ABI and contract address
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Endpoint to register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, displayName } = req.body;
        const userAddress = 'USER_ADDRESS'; // Replace with the actual user's Ethereum address
        const privateKey = '0xbd309a57e64897cb98db699a7a652628a5e1059d7223f131ecf1d8466bc0e701'; // Replace with the user's private key

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
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({ success: true, message: 'User registered successfully', receipt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to register user' });
    }
});

// Endpoint to get user profile
app.get('/profile', async (req, res) => {
    try {
        // Make sure to replace 'USER_ADDRESS' with the user's Ethereum address
        const userAddress = 'USER_ADDRESS';
        const userProfile = await contract.methods.users(userAddress).call();

        res.json({ success: true, data: userProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});