// imports/api/messages/MessagesService.js
import { MessagesCollection } from "../Collections/MessagesCollection";

export const MessagesService = {
    async addMessage({ text, senderID, receiverId }) {
        if (!senderID) throw new Error("User not authorized");
        if (!receiverId) throw new Error("Receiver required");
        if (!text) throw new Error("Message text required");

        return await MessagesCollection.insertAsync({
            text,
            senderID,
            receiverId,
            createdAt: new Date(),
        });
    },

    async getConversation(userA, userB) {
        return await MessagesCollection.find({
            $or: [
                { senderId: userA, receiverId: userB },
                { senderId: userB, receiverId: userA },
            ],
        }).fetchAsync();
    },
};
