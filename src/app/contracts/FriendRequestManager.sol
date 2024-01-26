// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FriendRequestManager
 * @dev A smart contract for managing friend requests between users.
 */
contract FriendRequestManager {
    // Enum to represent the status of a friend request
    enum RequestStatus {
        Pending,
        Accepted,
        Rejected
    }

    // Struct to represent a friend request
    struct FriendRequest {
        address sender;
        address receiver;
        RequestStatus status;
    }

    // Mapping to store friend requests
    mapping(address => FriendRequest[]) public incomingFriendRequests;
    mapping(address => FriendRequest[]) public outgoingFriendRequests;

    // Event emitted when a new friend request is sent
    event FriendRequestSent(address indexed sender, address indexed receiver);

    // Event emitted when a friend request is accepted or rejected
    event FriendRequestUpdated(address indexed sender, address indexed receiver, RequestStatus status);

    /**
     * @dev Sends a friend request to another user.
     * @param _receiver The address of the user to whom the friend request is sent.
     */
    function sendFriendRequest(address _receiver) external {
        require(msg.sender != _receiver, "Cannot send friend request to yourself");

        // Check if a friend request already exists
        require(!friendRequestExists(msg.sender, _receiver), "Friend request already exists");

        // Create a new friend request
        FriendRequest memory newRequest = FriendRequest({
            sender: msg.sender,
            receiver: _receiver,
            status: RequestStatus.Pending
        });

        // Add the friend request to the sender's outgoing requests and receiver's incoming requests
        outgoingFriendRequests[msg.sender].push(newRequest);
        incomingFriendRequests[_receiver].push(newRequest);

        // Emit event
        emit FriendRequestSent(msg.sender, _receiver);
    }

    /**
     * @dev Responds to a friend request by accepting or rejecting it.
     * @param _sender The address of the user who sent the friend request.
     * @param _accept A boolean indicating whether the friend request is accepted (true) or rejected (false).
     */
    function respondToFriendRequest(address _sender, bool _accept) external {
        // Find the friend request
        FriendRequest[] storage incomingRequests = incomingFriendRequests[msg.sender];
        FriendRequest[] storage outgoingRequests = outgoingFriendRequests[_sender];

        uint256 index = findFriendRequestIndex(incomingRequests, _sender);

        require(index < incomingRequests.length, "Friend request not found");
        require(incomingRequests[index].status == RequestStatus.Pending, "Friend request has already been responded to");

        // Update the status of the friend request
        incomingRequests[index].status = _accept ? RequestStatus.Accepted : RequestStatus.Rejected;
        outgoingRequests[index].status = _accept ? RequestStatus.Accepted : RequestStatus.Rejected;

        // Emit event
        emit FriendRequestUpdated(_sender, msg.sender, incomingRequests[index].status);
    }

    /**
     * @dev Gets the incoming friend requests for the caller.
     * @return An array of incoming friend requests.
     */
    function getIncomingFriendRequests() external view returns (FriendRequest[] memory) {
        return incomingFriendRequests[msg.sender];
    }

    /**
     * @dev Gets the outgoing friend requests for the caller.
     * @return An array of outgoing friend requests.
     */
    function getOutgoingFriendRequests() external view returns (FriendRequest[] memory) {
        return outgoingFriendRequests[msg.sender];
    }

    /**
     * @dev Checks if a friend request already exists.
     * @param _sender The address of the user who sent the friend request.
     * @param _receiver The address of the user who received the friend request.
     * @return A boolean indicating whether the friend request already exists.
     */
    function friendRequestExists(address _sender, address _receiver) internal view returns (bool) {
        FriendRequest[] storage outgoingRequests = outgoingFriendRequests[_sender];

        for (uint256 i = 0; i < outgoingRequests.length; i++) {
            if (outgoingRequests[i].receiver == _receiver && outgoingRequests[i].status == RequestStatus.Pending) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Finds the index of a friend request.
     * @param _requests The array of friend requests to search.
     * @param _target The address of the user involved in the friend request.
     * @return The index of the friend request in the array.
     */
    function findFriendRequestIndex(FriendRequest[] storage _requests, address _target) internal view returns (uint256) {
        for (uint256 i = 0; i < _requests.length; i++) {
            if (_requests[i].sender == _target || _requests[i].receiver == _target) {
                return i;
            }
        }
        return _requests.length;
    }
}
