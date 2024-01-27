// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title UserRegistery
 * @dev A smart contract for user registration and identity management on the Ethereum blockchain.
 */
contract UserRegistery {
    // Struct to represent user profile
    struct UserProfile {
        string username;
        string displayName;
    }

    // Mapping from Ethereum address to UserProfile
    mapping(address => UserProfile) public users;

    // Event emitted when a new user is registered
    event UserRegistered(address indexed userAddress, string username, string displayName);

    // Modifier to ensure a user is not already registered and the username is unique
    modifier notRegistered(string memory _username) {
        require(bytes(users[msg.sender].username).length == 0 && bytes(users[msg.sender].displayName).length == 0, "User already registered with this account");
        require(bytes(_username).length > 6, "Username cannot be empty or less than 6 characters");
        require(isUsernameUnique(_username), "Username is already taken");
        _;
    }

    // Internal function to check if a username is unique
    function isUsernameUnique(string memory _username) internal view returns (bool) {
        for (uint256 i = 0; i < registeredUsers.length; i++) {
            address userAddress = registeredUsers[i];
            if (keccak256(bytes(users[userAddress].username)) == keccak256(bytes(_username))) {
                return false; // Username is not unique
            }
        }
        return true; // Username is unique
    }

    /**
     * @dev Registers a new user with a unique username.
     * @param _username The username of the new user.
     * @param _displayName The display name of the new user.
     */
    function registerUser(string memory _username, string memory _displayName) external notRegistered(_username) {
        // Create a new user profile
        UserProfile storage newUser = users[msg.sender];
        newUser.username = _username;
        newUser.displayName = _displayName;

        // Store the address of the new user
        registeredUsers.push(msg.sender);

        // Emit event
        emit UserRegistered(msg.sender, _username, _displayName);
    }

    /**
     * @dev Retrieves the user profile of the calling user.
     * @return The username and display name of the user.
     */
    function getUserProfile() external view returns (string memory, string memory) {
        UserProfile storage user = users[msg.sender];
        return (user.username, user.displayName);
    }

    // Dynamic array to store all registered user addresses
    address[] private registeredUsers;

    /**
     * @dev Retrieves all registered user addresses.
     * @return An array of all registered user addresses.
     */
    function getAllUserAddresses() external view returns (address[] memory) {
        return registeredUsers;
    }
}
