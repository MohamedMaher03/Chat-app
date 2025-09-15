import React, { useState, useEffect, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../api/Collections/MessagesCollection";
import { ProfilesCollection } from "../api/Collections/ProfilesCollection";

export const Chat = ({ receiverId }) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, isLoading, receiverProfile, userProfiles } = useTracker(
    () => {
      if (!receiverId)
        return {
          messages: [],
          isLoading: false,
          receiverProfile: null,
          userProfiles: {},
        };

      const messagesHandle = Meteor.subscribe("privateMessages", receiverId);
      const profilesHandle = Meteor.subscribe("profiles");
      const loading = !messagesHandle.ready() || !profilesHandle.ready();

      const messageQuery = {
        $or: [
          { senderID: Meteor.userId(), receiverId: receiverId },
          { senderID: receiverId, receiverId: Meteor.userId() },
        ],
      };

      const receiver = ProfilesCollection.findOne({ userId: receiverId });

      const allProfiles = ProfilesCollection.find().fetch();
      const profilesMap = {};

      allProfiles.forEach((profile) => {
        profilesMap[profile.userId] = profile;
      });

      return {
        isLoading: loading,
        messages: MessagesCollection.find(messageQuery, {
          sort: { createdAt: 1 },
        }).fetch(),
        receiverProfile: receiver,
        userProfiles: profilesMap,
      };
    }
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    Meteor.call("messages.send", receiverId, messageText, (error) => {
      if (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message: " + error.reason);
      } else {
        setMessageText("");
      }
    });
  };

  if (isLoading) {
    return <div className="loading">Loading messages...</div>;
  }

  const currentUserId = Meteor.userId();
  const currentUserProfile = userProfiles[currentUserId];

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        {receiverProfile && (
          <>
            <img
              src={receiverProfile.avatar || "/default-avatar.png"}
              alt={receiverProfile.username}
              className="chat-avatar"
            />
            <div className="chat-user-info">
              <h3>{receiverProfile.username}</h3>
            </div>
          </>
        )}
      </div>

      {/* Messages Container */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderID === currentUserId;
            const senderProfile = userProfiles[msg.senderID];

            return (
              <div
                key={msg._id}
                className={`message ${
                  isOwnMessage ? "own-message" : "other-message"
                }`}
              >
                {!isOwnMessage && (
                  <img
                    src={senderProfile?.avatar || "/default-avatar.png"}
                    alt="Sender Avatar"
                    className="message-avatar"
                  />
                )}

                <div className="message-content">
                  {!isOwnMessage && (
                    <div className="message-sender">
                      {senderProfile?.username || "Unknown User"}
                    </div>
                  )}
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">
                      {msg.createdAt?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {isOwnMessage && (
                  <img
                    src={currentUserProfile?.avatar || "/default-avatar.png"}
                    alt="Your Avatar"
                    className="message-avatar"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="message-input"
        />
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>

      <style jsx>{`
        /* Chat Container */
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        /* Chat Header */
        .chat-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
        }

        .chat-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 15px;
          object-fit: cover;
        }

        .chat-user-info h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        /* Messages Container */
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
          background: #e5ddd5;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23aaaaaa' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        /* Individual Message */
        .message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .own-message {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }

        .message-sender {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          margin-left: 8px;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          display: inline-block;
        }

        .other-message .message-bubble {
          background: white;
          border-top-left-radius: 4px;
        }

        .own-message .message-bubble {
          background: #dcf8c6;
          border-top-right-radius: 4px;
        }

        .message-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
        }

        .message-time {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
          display: block;
          text-align: right;
        }

        /* No Messages */
        .no-messages {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        /* Message Form */
        .message-form {
          display: flex;
          padding: 15px;
          background: white;
          border-top: 1px solid #e0e0e0;
          gap: 10px;
        }

        .message-input {
          flex: 1;
          padding: 12px 18px;
          border-radius: 24px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 14px;
          background: #f0f0f0;
        }

        .message-input:focus {
          background: white;
          border-color: #007bff;
        }

        .send-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: #007bff;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};
