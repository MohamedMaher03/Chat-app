import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base';
import { ProfilesCollection } from '../imports/api/Collections/ProfilesCollection';
import { UserStatusCollection } from '../imports/api/Collections/userStatusCollection';

import "../imports/api/Methods/messagesMethods";
import "../imports/api/Publications/messagesPublications";
import "../imports/api/Publications/usersPublications";
import "../imports/api/Publications/profilesPublications";

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}




Meteor.startup(async () => {
  // If the Links collection is empty, add some data.

  Accounts.onCreateUser(async (options, user) => {
    await ProfilesCollection.insertAsync({
      userId: user._id,
      username: user.username,
      avatar: "https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg"
    });

    return user;
  });



  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://react-tutorial.meteor.com/simple-todos/01-creating-app.html',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});
