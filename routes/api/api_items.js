const path = require('path');

const app = require(path.join(__basedir, "app"));
const router = global.express.Router();

// services
let itemsService = require(path.join(__basedir, "modules/services/items"));

/* GET users listing. */
router.get("/api/item/list", async function (req, res) {
    let filter = req.body.filter;
    if (filter && filter._id) {
        filter._id = app.get('mongo').ObjectID(filter._id);
    }
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

/* POST users listing. */
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

    let item = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        price: req.body.price,
        highlighter: req.body.highlighter,
        sellerUser: req.body.sellerUser,
        buyerUser: null,
        chats: []
    };

    item = await itemsService.addItem(item);
    if (item === null) {
        return error(res, "insert", 500);
    }

    res.status(200);
    return res.json(item);
});

module.exports = router;

function error(res, param, status = 442) {
    res.status(status);
    return res.json({error: param});
}

