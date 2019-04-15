const repo = require("../repository");

module.exports = {
    async addUser(user) {
        try {
            return await repo.insert('users', user);
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
    async findAllUsersPage(filter, pg) {
        try {
            return await repo.findAllPage('users', filter, pg);
        } catch (error) {
            return null;
        }
    },

};
