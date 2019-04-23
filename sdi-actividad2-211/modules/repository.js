const mongo = require('mongodb');

const url = "mongodb://admin:oyp2XjWbzg2xGidG@cluster0-shard-00-00-ixeb7.mongodb.net:27017,cluster0-shard-00-01-ixeb7.mongodb.net:27017,cluster0-shard-00-02-ixeb7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

module.exports = {
    async insert(collection, item) {
        const db = await mongo.MongoClient.connect(url);
        let itemR = await db.collection(collection).insertOne(item);
        return itemR.ops[0];
    },

    async update(collection, filter, item) {
        const db = await mongo.MongoClient.connect(url);
        await changeIds(filter);
        return await db.collection(collection).updateOne(filter, {$set: item});
    },

    async remove(collection, item) {
        const db = await mongo.MongoClient.connect(url);
        return await db.collection(collection).removeOne(item);
    },

    async findOne(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        await changeIds(filter);
        return await db.collection(collection).findOne(filter);
    },

    async findAll(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        await changeIds(filter);
        let cursor = await db.collection(collection).find(filter);
        return await cursor.toArray();
    },

    async findAllPage(collection, filter, pg, page) {
        const db = await mongo.MongoClient.connect(url);
        await changeIds(filter);
        let cursor = await db.collection(collection).find(filter).skip((pg - 1) * page).limit(page);
        let pages = Math.trunc(await db.collection(collection).count(filter) / (page + 1));
        return {
            array: await cursor.toArray(),
            pages: pages + 1
        };
    },

    async count(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        await changeIds(filter);
        return await db.collection(collection).count(filter);
    },
};

async function changeIds(filter, propertyBefore) {
    for (let property in filter) {
        if (filter.hasOwnProperty(property)) {
            if (typeof filter[property] == "object") {
                await changeIds(filter[property], property);
            } else {
                if (property.includes('_id') || propertyBefore && propertyBefore.includes('_id')) {
                    filter[property] = mongo.ObjectID(filter[property]);
                }
            }
        }
    }
}
