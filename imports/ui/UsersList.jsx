import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { ProfilesCollection } from "../api/Collections/ProfilesCollection";
export const UsersList = ({ onUserSelect }) => {
  const { profiles, isLoading } = useTracker(() => {
    const profilesHandle = Meteor.subscribe("profiles");
    const loading = !profilesHandle.ready();

    return {
      isLoading: loading,
      profiles: ProfilesCollection.find().fetch(),
    };
  });

  const currentUserId = Meteor.userId();

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  // Filter out the current user
  const otherUsers = profiles.filter(
    (profile) => profile.userId !== currentUserId
  );

  return (
    <div className="users-list-container">
      <h2>Select a user to chat with:</h2>
      <div className="users-grid">
        {otherUsers.length === 0 ? (
          <p>No other users found.</p>
        ) : (
          otherUsers.map((user) => (
            <div
              key={user._id}
              className="user-card"
              onClick={() => onUserSelect(user)}
            >
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="default-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <h3>{user.username}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
