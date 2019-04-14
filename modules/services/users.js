module.exports = {
    init: function (app) {
        let repo = require("../repository");
        this.repositorio = new repo(app);
    },
    addUser: function (usuario, funcionCallback) {
        this.repositorio.insert('users', funcionCallback, usuario);
    },
    findAllUsers: function (criterio, funcionCallback) {
        this.repositorio.findAll('users', funcionCallback, criterio);
    },

};
