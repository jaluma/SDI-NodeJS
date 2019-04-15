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
    async findAllUsers(filter) {
        try {
            return await repo.findAll('items', filter);
        } catch (error) {
            return null;
        }
    },

};
