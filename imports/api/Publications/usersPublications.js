import { Meteor } from "meteor/meteor";

Meteor.publish("users.usernames", function () {
    return Meteor.users.find({}, { fields: { username: 1 } });
});