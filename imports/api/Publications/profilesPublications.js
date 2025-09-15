import { Meteor } from "meteor/meteor";
import { ProfilesCollection } from "../Collections/ProfilesCollection";

Meteor.publish("profiles", function () {
    return ProfilesCollection.find({}, { fields: { username: 1, avatar: 1, userId: 1 } });
});
