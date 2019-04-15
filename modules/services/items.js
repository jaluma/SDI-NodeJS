const repo = require("../repository");

module.exports = {
    async addItem(item) {
        try {
            return await repo.insert('items', item);
        } catch (error) {
            return null;
        }
    },
    async removeItem(filter) {
        try {
            return await repo.delete('items', filter);
        } catch (error) {
            return null;
        }
    },
    async findOne(filter) {
        try {
            return await repo.findOne('items', filter);
        } catch (error) {
            return null;
        }
    },
    async findAllItems(filter) {
        try {
            return await repo.findAll('items', filter);
        } catch (error) {
            return null;
        }
    },
    async findAllItemsPage(filter, pg) {
        try {
            return await repo.findAllPage('items', filter, pg);
        } catch (error) {
            return null;
        }
    },

};
