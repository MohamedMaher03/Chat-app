import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const HandleRegister = (e) => {
    e.preventDefault();
    Accounts.createUser({ email, password, username }, (error) => {
      if (error) {
        alert("Error: " + error.reason);
      } else {
        alert("User created successfully!");
      }
    });
  };

  return (
    <form onSubmit={HandleRegister} className="register-form">
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </div>
    </form>
  );
};
