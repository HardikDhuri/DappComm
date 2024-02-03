// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title NotificationManager
 * @dev A smart contract for managing user notifications.
 */
contract NotificationManager {
    // Enum to represent different types of notifications
    enum NotificationType {
        FriendRequestReceived,
        FriendRequestAccepted
        // Add more notification types as needed
    }

    // Struct to represent a user notification
    struct UserNotification {
        NotificationType notificationType;
        string message;
        address sender;
    }

    // Mapping to store user notifications
    mapping(address => UserNotification[]) public userNotifications;

    // Event emitted when a new notification is added
    event NotificationAdded(address indexed user, NotificationType notificationType, string message, address sender);

    /**
     * @dev Adds a new notification for a user.
     * @param _user The address of the user to receive the notification.
     * @param _notificationType The type of notification.
     * @param _message The message associated with the notification.
     * @param _sender The address of the sender (e.g., the one who sent a friend request).
     */
    function addNotification(address _user, NotificationType _notificationType, string memory _message, address _sender) external {
        // Create a new notification
        UserNotification memory newNotification = UserNotification({
            notificationType: _notificationType,
            message: _message,
            sender: _sender
        });

        // Add the notification to the user's list
        userNotifications[_user].push(newNotification);

        // Emit event
        emit NotificationAdded(_user, _notificationType, _message, _sender);
    }

    /**
     * @dev Gets all notifications for a user.
     * @param _user The address of the user to retrieve notifications for.
     * @return An array of notifications.
     */
    function getAllNotifications(address _user) external view returns (UserNotification[] memory) {
        return userNotifications[_user];
    }
}
