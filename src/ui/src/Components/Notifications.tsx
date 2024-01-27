// Notifications.tsx

import React from "react";

const Notifications: React.FC = () => {
  // Example notifications
  const notifications = [
    { type: "accept", user: "Alice" },
    { type: "request", user: "Bob" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Notifications</h2>
      {/* Display Notifications Wrapper Component */}
      {notifications.map((notification, index) => (
        <NotificationWrapper
          key={index}
          type={notification.type}
          user={notification.user}
        />
      ))}
    </div>
  );
};

interface NotificationWrapperProps {
  type: "accept" | "request" | string;
  user: string;
}

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({
  type,
  user,
}) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      {type === "accept" && (
        <p className="text-green-500">
          <span className="font-bold">{user}</span> accepted your friend
          request.
        </p>
      )}
      {type === "request" && (
        <p className="text-blue-500">
          You have a friend request from{" "}
          <span className="font-bold">{user}</span>.
        </p>
      )}
    </div>
  );
};

export default Notifications;
