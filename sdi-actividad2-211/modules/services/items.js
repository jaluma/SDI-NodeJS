const repo = require("../repository");

const collection = "items";

module.exports = {
    async addItem(item) {
        try {
            return await repo.insert(collection, item);
        } catch (error) {
            return null;
        }
    },
    async updateItem(filter, item) {
        try {
            return await repo.update(collection, filter, item);
        } catch (error) {
            return null;
        }
    },
    async removeItem(filter) {
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
    async findAllItems(filter) {
        try {
            return await repo.findAll(collection, filter);
        } catch (error) {
            return null;
        }
    },
    async findAllItemsPage(filter, pg, page = 5) {
        try {
            return await repo.findAllPage(collection, filter, pg, page);
        } catch (error) {
            return null;
        }
    },

};
