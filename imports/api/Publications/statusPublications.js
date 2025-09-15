import { Meteor } from "meteor/meteor";
import { UserStatusCollection } from "../Collections/userStatusCollection";

Meteor.publish("userStatus", function () {
    // publish only usernames & avatars, not passwords!
    return UserStatusCollection.find({}, {
        fields: { userId: 1, username: 1, avatar: 1, online: 1 }
    });
});
