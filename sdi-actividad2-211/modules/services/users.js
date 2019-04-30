const repo = require("../repository");

const collection = "users";

module.exports = {
    async addUser(user) {
        try {
            return await repo.insert(collection, user);
        } catch (error) {
            return null;
        }
    },
    async updateUser(filter, user) {
        try {
            return await repo.update(collection, filter, user);
        } catch (error) {
            return null;
        }
    },
    async removeUser(filter) {
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
    async findAllUsers(filter) {
        try {
            return await repo.findAll(collection, filter);
        } catch (error) {
            return null;
        }
    },
    async findAllUsersPage(filter, pg, page = 10) {
        try {
            return await repo.findAllPage(collection, filter, pg, page);
        } catch (error) {
            return null;
        }
    },

};
