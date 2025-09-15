import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "../Collections/MessagesCollection";

Meteor.publish("messages", function () {
    return MessagesCollection.find({}, { sort: { createdAt: -1 }, limit: 20 });
});




Meteor.publish("privateMessages", async function (otherUserId) {
    if (!this.userId) {
        console.log("Publication: No user ID, returning empty");
        return this.ready();
    }


    try {
        const query = {
            $or: [
                { senderID: this.userId, receiverId: otherUserId },
                { senderID: otherUserId, receiverId: this.userId },
            ],
        };

        const messageCount = await MessagesCollection.find(query).countAsync();

        if (messageCount > 0) {
            const messages = await MessagesCollection.find(query).fetchAsync();
        }

        return MessagesCollection.find(
            query,
            { sort: { createdAt: -1 }, limit: 50 }
        );
    } catch (error) {
        console.error("Publication error:", error);
        return this.ready();
    }
});