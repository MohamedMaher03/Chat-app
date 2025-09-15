import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../api/Collections/MessagesCollection";

export const DebugMessages = () => {
  const allMessages = useTracker(() => MessagesCollection.find().fetch());
  const currentUserId = Meteor.userId();

  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: "15px",
        marginTop: "20px",
        borderRadius: "5px",
        border: "1px solid #ddd",
      }}
    >
      <h3>Debug Information</h3>
      <p>
        <strong>Current User ID:</strong> {currentUserId}
      </p>
      <p>
        <strong>Total Messages in DB:</strong> {allMessages.length}
      </p>

      <div>
        <h4>All Messages:</h4>
        {allMessages.length === 0 ? (
          <p>No messages found in the database</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>ID</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Sender
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Receiver
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Text
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {allMessages.map((msg) => (
                <tr key={msg._id}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  >
                    {msg._id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {msg.senderId}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {msg.receiverId}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {msg.text}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  >
                    {msg.createdAt?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
