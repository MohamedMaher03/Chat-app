import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { LoginForm } from "./LoginForm.jsx";
import { RegisterForm } from "./RegisterForm.jsx";
import { UsersList } from "./UsersList.jsx";
import { Chat } from "./Chat.jsx";

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = useTracker(() => Meteor.user());

  const logout = () => {
    Meteor.logout();
    setSelectedUser(null);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="main-container">
          {selectedUser ? (
            <div className="chat-section">
              <div className="chat-header">
                <h2>Chat with {selectedUser.username}</h2>
              </div>
              <Chat receiverId={selectedUser.userId} />

              <button className="back-btn " onClick={handleBackToUsers}>
                &larr; Back to Users
              </button>
            </div>
          ) : (
            <div className="users-section">
              <div className="welcome-header">
                <h1>Hello, {user.username}</h1>
              </div>
              <UsersList onUserSelect={handleUserSelect} />
              <button className="btn logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-container">
          <div className="auth-box">
            <h2 className="auth-title">
              {showRegister ? "Create an Account" : "Welcome Back"}
            </h2>

            {showRegister ? <RegisterForm /> : <LoginForm />}

            <button
              className="btn switch-btn"
              onClick={() => setShowRegister(!showRegister)}
            >
              {showRegister ? "Already have an account?" : "Switch to Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
