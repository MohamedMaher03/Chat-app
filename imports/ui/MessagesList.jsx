import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../api/Collections/MessagesCollection";
import { Meteor } from "meteor/meteor";

export const MessagesList = () => {
  const { messages, isLoading } = useTracker(() => {
    const messagesHandle = Meteor.subscribe("messages");
    const usersHandle = Meteor.subscribe("users.usernames");

    const loading = !messagesHandle.ready() || !usersHandle.ready();

    return {
      isLoading: loading,
      messages: MessagesCollection.find(
        {},
        { sort: { createdAt: -1 } }
      ).fetch(),
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((msg) => {
          const user = Meteor.users.findOne(msg.userId);
          const username = user?.username || "Unknown";
          return (
            <li key={msg._id}>
              <strong>{username}:</strong> {msg.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
