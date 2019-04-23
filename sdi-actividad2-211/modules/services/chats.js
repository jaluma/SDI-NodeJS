const repo = require("../repository");

const collection = "chats";

module.exports = {
    async createChat(chat) {
        try {
            return await repo.insert(collection, chat);
        } catch (error) {
            return null;
        }
    },
    async updateChat(filter, chat) {
        try {
            return await repo.updateP(collection, filter, chat);
        } catch (error) {
            return null;
        }
    },
    async removeChat(filter) {
        try {
            return await repo.remove(collection, filter);
        } catch (error) {
            return null;
        }
    },
    async findOne(filter) {
        try {
            return await repo.findOne(collection, filter);
        } catch (error) {
            return null;
        }
    },
    async findAllChats(filter) {
        try {
            return await repo.findAll(collection, filter);
        } catch (error) {
            return null;
        }
    },
    async findAllChatsPage(filter, pg, page = 10) {
        try {
            return await repo.findAllPage(collection, filter, pg, page);
        } catch (error) {
            return null;
        }
    },
};
