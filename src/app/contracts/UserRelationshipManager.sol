// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserRegistery.sol";

interface IUserRegistery {
    function getUserProfileByAddress(address _userAddress) external view returns (string memory, string memory);
}

/**
 * @title UserRelationshipManager
 * @dev A smart contract for managing user relationships including friendships, removals, blocking, and friend requests.
 */
contract UserRelationshipManager {
    // Enum to represent the status of a user relationship
    enum RelationshipStatus {
        None,
        Friends,
        Blocked
    }

    // Struct to represent a user relationship
    struct UserRelationship {
        address user;
        RelationshipStatus status;
    }

    // Struct to represent a friend request
    struct FriendRequest {
        address sender;
        address receiver;
        bool accepted;
    }

    // Address of the UserRegistery contract
    address public usersContractAddress;

    /**
     * @dev Constructor that sets the address of the UserRegistery contract.
     * @param _usersContractAddress The address of the UserRegistery contract.
     */
    constructor(address _usersContractAddress) {
        require(_usersContractAddress != address(0), "Invalid user registery contract address");
        usersContractAddress = _usersContractAddress;
    }

    // Mapping to store user relationships
    mapping(address => UserRelationship[]) public userRelationships;

    // Mapping to store friend requests
    mapping(address => FriendRequest[]) public friendRequests;

    // Event emitted when a user becomes friends with another user
    event FriendsAdded(address indexed user1, address indexed user2);

    // Event emitted when a user removes another user as a friend
    event FriendsRemoved(address indexed user1, address indexed user2);

    // Event emitted when a user blocks another user
    event UserBlocked(address indexed blocker, address indexed blocked);

    // Event emitted when a friend request is sent
    event FriendRequestSent(address indexed sender, address indexed receiver);

    // Event emitted when a friend request is accepted
    event FriendRequestAccepted(address indexed sender, address indexed receiver);

    // Event emitted when a friend request is rejected or cancelled
    event FriendRequestRejectedOrCancelled(address indexed sender, address indexed receiver);

    /**
     * @dev Adds a user as a friend after a friend request has been accepted.
     * @param _friend The address of the user to become friends with.
     */
    function addFriend(address _friend) internal {
        // Check if users are friends already
        require(!areFriends(msg.sender, _friend), "Users are already friends");

        // Create a new user relationship
        UserRelationship memory newRelationship = UserRelationship({
            user: _friend,
            status: RelationshipStatus.Friends
        });

        // Add the relationship to both users' relationship lists
        userRelationships[msg.sender].push(newRelationship);
        userRelationships[_friend].push(UserRelationship({user: msg.sender, status: RelationshipStatus.Friends}));

        // Emit event
        emit FriendsAdded(msg.sender, _friend);
    }

    /**
     * @dev Accepts a friend request from another user.
     * @param _friend The address of the user who sent the friend request.
     */
    function acceptFriendRequest(address _friend) external {
        // Check if a friend request exists
        require(hasPendingFriendRequest(_friend, msg.sender), "No pending friend request");

        // Update the status of the friend request to accepted
        FriendRequest[] storage requests = friendRequests[msg.sender];
        uint256 index = findFriendRequestIndex(requests, _friend);

        require(index < requests.length, "Friend request not found");

        requests[index].accepted = true;

        // Add the users as friends
        addFriend(_friend);

        delete requests[index];

        // Emit event
        emit FriendRequestAccepted(_friend, msg.sender);
    }

    /**
     * @dev Removes a user as a friend.
     * @param _formerFriend The address of the user to remove as a friend.
     */
    function removeFriend(address _formerFriend) external {
        // Check if users are friends
        require(areFriends(msg.sender, _formerFriend), "Users are not friends");

        // Find and update the user relationship status
        UserRelationship[] storage senderRelationships = userRelationships[msg.sender];
        UserRelationship[] storage friendRelationships = userRelationships[_formerFriend];

        uint256 senderIndex = findUserRelationshipIndex(senderRelationships, _formerFriend);
        uint256 friendIndex = findUserRelationshipIndex(friendRelationships, msg.sender);

        require(senderIndex < senderRelationships.length, "User relationship not found");
        require(friendIndex < friendRelationships.length, "User relationship not found");

        // Update the status of the user relationship to None (no relationship)
        senderRelationships[senderIndex].status = RelationshipStatus.None;
        friendRelationships[friendIndex].status = RelationshipStatus.None;

        // Emit event
        emit FriendsRemoved(msg.sender, _formerFriend);
    }

    /**
     * @dev Blocks a user, ending the relationship.
     * @param _blockedUser The address of the user to block.
     */
    function blockUser(address _blockedUser) external {
        // Check if users are friends
        require(areFriends(msg.sender, _blockedUser), "Users are not friends");

        // Find and update the user relationship status to Blocked
        UserRelationship[] storage senderRelationships = userRelationships[msg.sender];
        UserRelationship[] storage blockedUserRelationships = userRelationships[_blockedUser];

        uint256 senderIndex = findUserRelationshipIndex(senderRelationships, _blockedUser);
        uint256 blockedUserIndex = findUserRelationshipIndex(blockedUserRelationships, msg.sender);

        require(senderIndex < senderRelationships.length, "User relationship not found");
        require(blockedUserIndex < blockedUserRelationships.length, "User relationship not found");

        // Update the status of the user relationship to Blocked
        senderRelationships[senderIndex].status = RelationshipStatus.Blocked;
        blockedUserRelationships[blockedUserIndex].status = RelationshipStatus.Blocked;

        // Emit event
        emit UserBlocked(msg.sender, _blockedUser);
    }

    /**
     * @dev Sends a friend request to another user.
     * @param _friend The address of the user to send a friend request to.
     */
    function sendFriendRequest(address _friend) external {
        // Check if a friend request already exists
        require(!hasPendingFriendRequest(msg.sender, _friend), "Friend request already sent");

        // Create a new friend request
        FriendRequest memory newRequest = FriendRequest({
            sender: msg.sender,
            receiver: _friend,
            accepted: false
        });

        // Add the friend request to the receiver's list
        friendRequests[_friend].push(newRequest);

        // Emit event
        emit FriendRequestSent(msg.sender, _friend);
    }

    /**
     * @dev Rejects or cancels a friend request.
     * @param _friend The address of the user involved in the friend request.
     */
    function rejectOrCancelFriendRequest(address _friend) external {
        // Check if a friend request exists
        require(hasPendingFriendRequest(_friend, msg.sender), "No pending friend request");

        // Remove the friend request
        FriendRequest[] storage requests = friendRequests[msg.sender];
        uint256 index = findFriendRequestIndex(requests, _friend);

        require(index < requests.length, "Friend request not found");

        delete requests[index];

        // Emit event
        emit FriendRequestRejectedOrCancelled(_friend, msg.sender);
    }

    /**
     * @dev Checks if two users are friends.
     * @param _user1 The address of the first user.
     * @param _user2 The address of the second user.
     * @return A boolean indicating whether the users are friends.
     */
    function areFriends(address _user1, address _user2) internal view returns (bool) {
        UserRelationship[] storage user1Relationships = userRelationships[_user1];

        for (uint256 i = 0; i < user1Relationships.length; i++) {
            if (user1Relationships[i].user == _user2 && user1Relationships[i].status == RelationshipStatus.Friends) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Checks if a pending friend request exists between two users.
     * @param _sender The sender of the friend request.
     * @param _receiver The receiver of the friend request.
     * @return A boolean indicating whether a pending friend request exists.
     */
    function hasPendingFriendRequest(address _sender, address _receiver) internal view returns (bool) {
        FriendRequest[] storage requests = friendRequests[_receiver];

        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].sender == _sender && !requests[i].accepted) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Finds the index of a user relationship.
     * @param _relationships The array of user relationships to search.
     * @param _target The address of the user involved in the relationship.
     * @return The index of the user relationship in the array.
     */
    function findUserRelationshipIndex(UserRelationship[] storage _relationships, address _target) internal view returns (uint256) {
        for (uint256 i = 0; i < _relationships.length; i++) {
            if (_relationships[i].user == _target) {
                return i;
            }
        }
        return _relationships.length;
    }

    /**
     * @dev Finds the index of a friend request.
     * @param _requests The array of friend requests to search.
     * @param _target The address of the user involved in the friend request.
     * @return The index of the friend request in the array.
     */
    function findFriendRequestIndex(FriendRequest[] storage _requests, address _target) internal view returns (uint256) {
        for (uint256 i = 0; i < _requests.length; i++) {
            if (_requests[i].sender == _target) {
                return i;
            }
        }
        return _requests.length;
    }

    /**
     * @dev Gets all friends for the caller.
     * @return An array of friend objects with address, username, and displayName.
     */
    function getAllFriends() external view returns (FriendInfo[] memory) {
        UserRelationship[] storage relationships = userRelationships[msg.sender];
        FriendInfo[] memory friends = new FriendInfo[](relationships.length);

        for (uint256 i = 0; i < relationships.length; i++) {
            if (relationships[i].status == RelationshipStatus.Friends) {
                (string memory username, string memory displayName) = IUserRegistery(usersContractAddress).getUserProfileByAddress(relationships[i].user);
                friends[i] = FriendInfo({
                    friendAddress: relationships[i].user,
                    friendUsername: username,
                    friendDisplayName: displayName
                });
            }
        }
        return friends;
    }

    // Struct to represent friend information
    struct FriendInfo {
        address friendAddress;
        string friendUsername;
        string friendDisplayName;
    }
}
