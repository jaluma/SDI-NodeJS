const repo = require("../repository");

const collection = "messages";

module.exports = {
    async addMessage(message) {
        try {
            return await repo.insert(collection, message);
        } catch (error) {
            return null;
        }
    },
    async updateMessage(filter, message) {
        try {
            return await repo.update(collection, filter, message);
        } catch (error) {
            return null;
        }
    },
    async removeMessage(filter) {
        try {
            return await repo.remove(collection, filter);
        } catch (error) {
            return null;
        }
    },
};
