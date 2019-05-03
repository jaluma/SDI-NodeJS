const mongo = require('mongodb');

const url = "mongodb://admin:oyp2XjWbzg2xGidG@cluster0-shard-00-00-ixeb7.mongodb.net:27017,cluster0-shard-00-01-ixeb7.mongodb.net:27017,cluster0-shard-00-02-ixeb7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

module.exports = {
    async insert(collection, item) {
        const db = await mongo.MongoClient.connect(url);
        item = await convertTypesMongo(item);
        let itemR = await db.collection(collection).insertOne(item);
        db.close();
        return await itemR.ops[0];
    },

    async update(collection, filter, item) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let update = await db.collection(collection).updateOne(filter, {$set: item});
        db.close();
        return update;
    },

    async updateP(collection, filter, item) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let update = await db.collection(collection).updateOne(filter, {$push: item});
        db.close();
        return update;
    },

    async remove(collection, item) {
        const db = await mongo.MongoClient.connect(url);
        item = await convertTypesMongo(item);
        let remove = await db.collection(collection).removeOne(item);
        db.close();
        return remove;
    },

    async findOne(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let one = await db.collection(collection).findOne(filter);
        db.close();
        return one;
    },

    async findAll(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let cursor = await db.collection(collection).find(filter);

        let sort = await cursor.sort({$natural: 1});
        sort = await sort.toArray();

        db.close();
        return sort;
    },

    async findAllPage(collection, filter, pg, page) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let cursor = await db.collection(collection).find(filter).skip((pg - 1) * page).limit(page);

        let sort = await cursor.sort({$natural: 1});
        sort = await sort.toArray();

        let count = await db.collection(collection).count(filter);

        db.close();

        let pages = Math.trunc(count / page) + 1;

        if (count % page === 0) {
            pages--;
        }
        return {
            array: sort,
            pages: pages
        };
    },

    async count(collection, filter) {
        const db = await mongo.MongoClient.connect(url);
        filter = await convertTypesMongo(filter);
        let count = await db.collection(collection).count(filter);
        db.close();
        return count;
    },
};

async function convertTypesMongo(filter, propertyBefore) {
    // convertimos a string para que no haya problemas
    filter = JSON.stringify(filter);
    filter = JSON.parse(filter);

    for (let property in filter) {
        if (filter.hasOwnProperty(property)) {
            if (typeof filter[property] == "object") {
                filter[property] = await convertTypesMongo(filter[property], property);
            } else {
                if (includeProperty(property, propertyBefore, "_id")) {
                    filter[property] = mongo.ObjectID(filter[property]);
                }
                if (includeProperty(property, propertyBefore, "date") || includeProperty(property, propertyBefore, "time")) {
                    filter[property] = new Date(filter[property]);
                }
                if (Array.isArray(filter[property])) {
                    for (let index in filter[property]) {
                        filter[property] = await convertTypesMongo(filter[property], property);
                    }
                }
            }
        }
    }
    return filter;
}

function includeProperty(property, propertyBefore, searchString) {
    return property.includes(searchString) || propertyBefore && propertyBefore.includes(searchString) && !propertyBefore.includes('$')
}
