const path = require('path');

const router = global.express.Router();

// services
let itemsService = require(path.join(__basedir, "modules/services/items"));
let usersService = require(path.join(__basedir, "modules/services/users"));
let chatsService = require(path.join(__basedir, "modules/services/chats"));

/* GET chats listing. */
router.get("/api/chat/list", async function (req, res) {
    let filter = req.body.filter;
    let pages = req.body.page;

    let items;
    if (pages) {
        items = await chatsService.findAllChatsPage(filter, pages);
    } else {
        items = {
            array: await chatsService.findAllChats(filter),
            pages: 0
        };
    }

    if (items === null) {
        return error(res, "list");
    }

    res.status(200);
    return res.json(items);
});

router.get("/api/chat/:id", async function (req, res) {
    let id = req.params.id;

    let filter = {
        _id: id
    };

    let chat = await chatsService.findOne(filter);
    if (chat === null) {
        return error(res, "list");
    }

    chat.messages.sort(m => m.time);

    res.status(200);
    return res.json(chat);
});

/* POST chats listing. */
router.post("/api/chat/create", async function (req, res) {
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

    let user = req.body.sellerUser;

    let item = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        price: req.body.price,
        highlighter: req.body.highlighter,
        sellerUser: user,
        buyerUser: null
    };

    if (item.highlighter === true) {
        let sellerUser = await usersService.findOne(user);
        if (sellerUser === null) {
            return error(res, "sellerUser");
        }

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

/* DELETE chats listing. */
router.delete("/api/chat/delete/:id", async function (req, res) {
    let id = req.params.id;

    if (id === null) {
        return error(res, "chat");
    }

    let chat = {
        _id: id
    };

    let result = await chatsService.removeChat(chat);
    if (result === null) {
        return error(res, "remove", 500);
    }

    res.status(200);
    return res.json({
        count: result.deletedCount
    });
});

module.exports = router;

function error(res, param, status = 442) {
    res.status(status);
    return res.json({error: param});
}
