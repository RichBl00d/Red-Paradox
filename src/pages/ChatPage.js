
import React, { useState, useEffect } from "react";
import "../styles/ChatPage.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

const ChatPage = () => {
    const [messages, setMessages] = useState([]); // Chat messages
    const [input, setInput] = useState(""); // User input

    // Listen for incoming messages
    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.disconnect(); // Cleanup
    }, []);

    // Function to send a message
    const sendMessage = () => {
        if (input.trim()) {
            const message = { user: "Me", text: input };
            socket.emit("sendMessage", input); // Emit message to backend
            setMessages((prev) => [...prev, message]); // Add to local
            setInput(""); // Clear input
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            msg.user === "Me" ? "me" : "other"
                        }`}
                    >
                        {msg.user !== "Me" && (
                            <img
                                src="https://via.placeholder.com/30/2e2e2e"
                                alt="Avatar"
                            />
                        )}
                        <div className="message-content">{msg.text}</div>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="chat-send-button" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
