const path = require('path');

const router = global.express.Router();
const error = require(path.join(__basedir, "routes/api/util/api_error"));

// services
let itemsService = require(path.join(__basedir, "modules/services/items"));
let usersService = require(path.join(__basedir, "modules/services/users"));

/* GET items listing. */
router.get("/api/item/list/distint/:page", async function (req, res) {
    let pages = req.params.page;

    let filter = {
        "sellerUser._id": {
            $ne: res.locals.currentUser
        }
    };

    return await getList(pages, filter, res);
});

router.get("/api/item/purchases/:page", async function (req, res) {
    let filter = {
        "buyerUser._id": res.locals.currentUser._id
    };
    let pages = req.params.page;

    return await getList(pages, filter, res);
});

router.get("/api/item/mylist/:page", async function (req, res) {
    let filter = {
        "sellerUser._id": res.locals.currentUser._id
    };
    let pages = req.params.page;

    return await getList(pages, filter, res);
});

router.get("/api/item/hightlighterlist/:page", async function (req, res) {
    let filter = {
        highlighter: true,
        "sellerUser._id": {
            $ne: res.locals.currentUser._id
        }
    };
    let pages = req.params.page;

    return await getList(pages, filter, res);
});

router.get("/api/item/:id", async function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    let item = {
        _id: id
    };

    item = await itemsService.findOne(item);
    if (item === null) {
        return error(res, "item");
    }

    res.status(200);
    res.json(item);
});

/* POST items listing. */
router.post("/api/item/add", async function (req, res) {
    if (req.body.title === null) {
        return error(res, "title");
    }
    if (req.body.description === null) {
        return error(res, "description");
    }
    if (req.body.date === null) {
        return error(res, "date");
    }
    if (req.body.price === null) {
        return error(res, "price");
    }
    if (req.body.highlighter === null) {
        return error(res, "highlighter");
    }
    if (req.body.sellerUser === null) {
        return error(res, "sellerUser");
    }

    let sellerUser = res.locals.currentUser;

    let item = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        price: req.body.price,
        highlighter: req.body.highlighter,
        sellerUser: sellerUser,
        buyerUser: null
    };

    if (item.highlighter === true) {
        if (sellerUser.money < 20) {
            return error(res, "money");
        }

        let result = await usersService.updateUser(sellerUser, {
            money: sellerUser.money - 20
        });

        if (result === null) {
            return error(res, "money");
        }
    }

    item = await itemsService.addItem(item);
    if (item === null) {
        return error(res, "insert", 500);
    }

    res.status(200);
    return res.json(item);
});

router.post("/api/item/list", async function (req, res) {
    let filter = req.body.filter;
    let pages = req.body.page;

    return await getList(pages, filter, res);
});

/* PUT items listing. */
router.put("/api/item/buy/:id", async function (req, res) {
    if (!req.params.id) {
        return error(res, "item");
    }

    let filter = {
        _id: req.params.id
    };

    let buyerUser = {
        _id: res.locals.currentUser._id
    };

    buyerUser = await usersService.findOne(buyerUser);
    if (buyerUser === null) {
        return error(res, "buyerUser");
    }

    let item = await itemsService.findAllItems(filter);
    if (item === null) {
        return error(res, "item");
    }
    item = item[0];

    if (item.buyerUser || buyerUser._id.toString() === item.sellerUser._id.toString()) {
        return error(res, "user");
    }

    if (buyerUser.money < item.price) {
        return error(res, "money");
    }

    // update item and user
    let result = await itemsService.updateItem(filter, {
        buyerUser: buyerUser
    });
    if (result === null) {
        return error(res, "update", 500);
    }

    result = await usersService.updateUser(buyerUser, {
        money: buyerUser.money - item.price
    });
    if (result === null) {
        return error(res, "error");
    }

    res.status(200);
    return res.json({
        count: result.modifiedCount,
        price: item.price
    });
});

router.put("/api/item/highlighter/:id", async function (req, res) {
    let id = req.params.id;

    if (id === null) {
        return error(res, "item");
    }

    let item = {
        _id: id
    };

    item = await itemsService.findAllItems(item);
    if (item === null) {
        return error(res, "item");
    }
    item = item[0];

    let filter = {
        _id: item.sellerUser._id
    };

    let sellerUser = await usersService.findOne(filter);
    if (sellerUser === null) {
        return error(res, "sellerUser");
    }

    if (sellerUser._id.toString() !== res.locals.currentUser._id.toString()) {
        return error(res, "forbidden", 403);
    }

    if (sellerUser.money < 20) {
        return error(res, "money");
    }

    let result = await usersService.updateUser(filter, {
        money: sellerUser.money - 20
    });
    if (result === null) {
        return error(res, "error");
    }

    result = await itemsService.updateItem(item, {
        highlighter: true
    });
    if (result === null) {
        return error(res, "update", 500);
    }

    res.status(200);
    return res.json({
        count: result.modifiedCount
    });
});

/* DELETE items listing. */
router.delete("/api/item/delete/:id", async function (req, res) {
    let id = req.params.id;

    if (id === null) {
        return error(res, "item");
    }

    let item = {
        _id: id
    };

    let result = await itemsService.removeItem(item);
    if (result === null) {
        return error(res, "remove", 500);
    }

    res.status(200);
    return res.json({
        count: result.deletedCount
    });
});

module.exports = router;

async function getList(pages, filter, res) {
    let items;
    if (pages) {
        items = await itemsService.findAllItemsPage(filter, pages);
    } else {
        items = {
            array: await itemsService.findAllItems(filter),
            pages: 0
        };
    }

    if (items === null) {
        return error(res, "list");
    }

    res.status(200);
    return res.json(items);
}
