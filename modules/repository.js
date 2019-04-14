module.exports = class Repositorio {
    constructor(app) {
        this.app = app;
        this.mongo = require('mongodb');
        this.url = "mongodb://admin:oyp2XjWbzg2xGidG@cluster0-shard-00-00-ixeb7.mongodb.net:27017,cluster0-shard-00-01-ixeb7.mongodb.net:27017,cluster0-shard-00-02-ixeb7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
        this.page = 4;
    }

    static callback(err, result, funcionCallback) {
        funcionCallback(err ? null : result);
    }

    insert(collection, funcionCallback, item) {
        this.connection(funcionCallback, (db) => {
            db.collection(collection).insert(item, (err, result) => {
                Repositorio.callback(err, result.ops[0]._id, funcionCallback);
            });
        });
    }

    update(collection, funcionCallback, criterio, item) {
        this.connection(funcionCallback, (db) => {
            db.collection(collection).update(criterio, {$set: item}, (err, result) => {
                Repositorio.callback(err, result, funcionCallback);
            });
        });
    }

    delete(collection, funcionCallback, criterio) {
        this.connection(funcionCallback, (db) => {
            db.collection(collection).remove(criterio, (err, result) => {
                Repositorio.callback(err, result, funcionCallback);
            });
        });
    }

    findAll(collection, funcionCallback, criterio) {
        this.connection(funcionCallback, (db) => {
            db.collection(collection).find(criterio).toArray((err, result) => {
                Repositorio.callback(err, result, funcionCallback);
            });
        });
    }

    findAllPage(collection, funcionCallback, criterio, pg) {
        this.connection(funcionCallback, (db) => {
            db.collection(collection).find(criterio).skip((pg - 1) * 4).limit(this.page).toArray((err, result) => {
                Repositorio.callback(err, result, funcionCallback);
            });
        });
    }

    size(collection, funcionCallback, criterio) {
        this.connection(() => {
        }, (db) => {
            db.collection(collection).count(criterio, (err, numItems) => {
                Repositorio.callback(err, numItems, funcionCallback);
            });
        });
    }

    connection(funcionCallback, funcionExito) {
        this.mongo.MongoClient.connect(this.url, (err, db) => {
            if (err) {
                funcionCallback(null);
                return;
            }

            funcionExito(db);
        });
    }

};

