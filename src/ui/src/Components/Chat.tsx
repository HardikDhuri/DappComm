// Chat.tsx

import React, { useState, useRef, useEffect } from "react";

interface Friend {
  id: string;
  displayName: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
}

interface ChatProps {
  selectedFriend: Friend | null;
}

const Chat: React.FC<ChatProps> = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    { id: "1", sender: "John", content: "Hello!" },
    { id: "2", sender: "Alice", content: "Hi there!" },
    // Add more messages as needed
  ]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Math.random().toString(),
      sender: "CurrentUser", // Replace with the actual username or user ID
      content: inputMessage.trim(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  // Scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Window */}
      <div
        className="flex-1 bg-background p-4 overflow-y-auto"
        ref={chatWindowRef}
      >
        {/* Display ChatWindow Component */}
        <ChatWindow messages={messages} />
      </div>

      {/* Message Input */}
      <div className="flex mt-4">
        <input
          type="text"
          className="w-full border text-black rounded-md py-2 px-3"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="bg-primary text-white py-2 px-4 rounded-md ml-2 hover:bg-accent transition duration-300"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1">
      {/* Display each message in the chat window */}
      {messages.map((message) => (
        <div key={message.id} className="mb-2">
          <span className="font-bold">{message.sender}: </span>
          <span>{message.content}</span>
        </div>
      ))}
    </div>
  );
};

export default Chat;
