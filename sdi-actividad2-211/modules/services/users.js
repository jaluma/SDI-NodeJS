const repo = require("../repository");

module.exports = {
    async addUser(user) {
        try {
            return await repo.insert('users', user);
        } catch (error) {
            return null;
        }
    },
    async updateUser(filter, user) {
        try {
            return await repo.update('users', filter, user);
        } catch (error) {
            return null;
        }
    },
    async removeUser(filter) {
        try {
            return await repo.delete('users', filter);
        } catch (error) {
            return null;
        }
    },
    async findOne(filter) {
        try {
            return await repo.findOne('users', filter);
        } catch (error) {
            return null;
        }
    },
    async findAllUsers(filter) {
        try {
            return await repo.findAll('users', filter);
        } catch (error) {
            return null;
        }
    },
    async findAllUsersPage(filter, pg, page = 10) {
        try {
            return await repo.findAllPage('users', filter, pg, page);
        } catch (error) {
            return null;
        }
    },

};
