import { Meteor } from "meteor/meteor";
import { MessagesService } from "../Services/messagesService";

Meteor.methods({
    "messages.send"(receiverId, text) {
        if (!this.userId) {
            throw new Meteor.Error("Not authorized");
        }
        return MessagesService.addMessage({ text, senderID: this.userId, receiverId });
    }
});
