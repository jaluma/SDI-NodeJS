const path = require('path');

const router = global.express.Router();
const error = require('./util/api_error');

// services
let itemsService = require(path.join(__basedir, "modules/services/items"));
let usersService = require(path.join(__basedir, "modules/services/users"));

/* GET items listing. */
router.get("/api/item/list", async function (req, res) {
    let filter = req.body.filter;
    let pages = req.body.page;

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
});

router.get("/api/item/list/distint", async function (req, res) {
    let pages = req.body.page;

    filter = {
        "sellerUser._id": {
            $ne: res.locals.currentUser
        }
    };

    let items;
    if (pages) {
        items = await itemsService.findAllItemsPage(filter, pages);
    } else {
        items = {
            array: await itemsService.findAllItems(filter),
            pages: 0
        };
    }

    if (items.array === null) {
        return error(res, "list");
    }

    res.status(200);
    return res.json(items);
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

router.post("/api/item/buy", async function (req, res) {
    let body = req.body.object;

    if (body._id === null) {
        return error(res, "item");
    }

    if (body.buyerUser._id === null) {
        return error(res, "buyerUser");
    }

    let filter = {
        _id: body._id
    };

    let buyerUser = res.locals.currentUser;

    let item = await itemsService.findAllItems(filter);
    if (item === null) {
        return error(res, "item");
    }
    item = item[0];

    if (item.buyerUser || buyerUser._id.equals(item.sellerUser._id)) {
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

/* PUT items listing. */
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
