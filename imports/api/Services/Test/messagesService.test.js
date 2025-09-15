import { MessagesService } from "../messagesService";
import { MessagesCollection } from "../../Collections/MessagesCollection";

jest.mock("../../Collections/MessagesCollection", () => ({
    MessagesCollection: {
        insertAsync: jest.fn(),
        findOneAsync: jest.fn(),
    },
}));

describe("MessagesService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should insert a new message", async () => {
        MessagesCollection.insertAsync.mockResolvedValue("fakeId123");

        const result = await MessagesService.addMessage({
            text: "Hello world",
            userId: "user1",
        });

        expect(MessagesCollection.insertAsync).toHaveBeenCalledTimes(1);
        expect(MessagesCollection.insertAsync).toHaveBeenCalledWith(
            expect.objectContaining({
                text: "Hello world",
                userId: "user1",
            })
        );
        expect(result).toBe("fakeId123");
    });

    it("should throw error if text is missing", async () => {
        await expect(
            MessagesService.addMessage({ text: "", userId: "user1" })
        ).rejects.toThrow("Message text required");
    });

    it("should throw error if user not authorized", async () => {
        await expect(
            MessagesService.addMessage({ text: "Hello world", userId: "" })
        ).rejects.toThrow("User not authorized");
    });

    it("should find message by id", async () => {
        MessagesCollection.findOneAsync.mockResolvedValue({
            _id: "msg1",
            text: "test msg",
        });

        const message = await MessagesService.getMessageById("msg1", "user1");

        expect(MessagesCollection.findOneAsync).toHaveBeenCalledWith("msg1");
        expect(message.text).toBe("test msg");
    });

    it("should throw error if user not authorized", async () => {
        await expect(
            MessagesService.getMessageById("msg1", "")
        ).rejects.toThrow("User not authorized");
    });

    it("should throw error if message id is missing", async () => {
        await expect(
            MessagesService.getMessageById("", "user1")
        ).rejects.toThrow("Message ID required");
    });


});
