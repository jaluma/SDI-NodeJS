const repo = require("../repository");

module.exports = {
    async addUser(usuario) {
        try {
            return await repo.insert('users', usuario);
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

};
