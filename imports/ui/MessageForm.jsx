import React, { useState } from "react";

export const MessageForm = () => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    Meteor.call("messages.insert", text, (err) => {
      if (err) {
        alert(err.reason);
      } else {
        setText("");
      }
    });
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        className="message-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button className="send-btn" type="submit">
        ➤
      </button>
    </form>
  );
};
