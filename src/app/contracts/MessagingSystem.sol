// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MessagingSystem
 * @dev A smart contract for facilitating secure and decentralized messaging between users.
 */
contract MessagingSystem {
    // Struct to represent a message
    struct Message {
        address sender;
        address receiver;
        string contentHash; // IPFS hash or any off-chain storage reference
        bool isEncrypted; // Indicator for encryption (if needed)
        uint256 timestamp;
    }

    // Event emitted when a new message is sent
    event MessageSent(address indexed sender, address indexed receiver, string contentHash, bool isEncrypted, uint256 timestamp);

    // Mapping to store user messages
    mapping(address => Message[]) public userMessages;

    /**
     * @dev Sends a message to another user.
     * @param _receiver The address of the user who will receive the message.
     * @param _contentHash The IPFS hash or off-chain storage reference of the message content.
     * @param _isEncrypted A boolean indicating whether the message is encrypted.
     */
    function sendMessage(address _receiver, string memory _contentHash, bool _isEncrypted) external {
        require(msg.sender != _receiver, "Cannot send a message to yourself");

        // Create a new message
        Message memory newMessage = Message({
            sender: msg.sender,
            receiver: _receiver,
            contentHash: _contentHash,
            isEncrypted: _isEncrypted,
            timestamp: block.timestamp
        });

        // Add the message to both sender's and receiver's message history
        userMessages[msg.sender].push(newMessage);
        userMessages[_receiver].push(newMessage);

        // Emit event
        emit MessageSent(msg.sender, _receiver, _contentHash, _isEncrypted, block.timestamp);
    }

    /**
     * @dev Retrieves the messages of the calling user.
     * @return An array of Message structures representing the user's messages.
     */
    function getUserMessages() external view returns (Message[] memory) {
        return userMessages[msg.sender];
    }
}
