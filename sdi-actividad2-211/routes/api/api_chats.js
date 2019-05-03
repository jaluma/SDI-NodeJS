const path = require('path');

const router = global.express.Router();
const error = require(path.join(__basedir, "routes/api/util/api_error"));

// services
let itemsService = require(path.join(__basedir, "modules/services/items"));
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

router.get("/api/chat/mylist/:page", async function (req, res) {
    let filter = {
        $or: [
            {
                messages: {
                    $elemMatch: {
                        "user._id": res.locals.currentUser._id
                    }
                }
            },
            {
                "item.sellerUser._id": res.locals.currentUser._id
            }
        ]

    };
    let pages = req.params.page;

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

    chat.messages.sort(function (a, b) {
        return a.time - b.time
    });

    res.status(200);
    return res.json(chat);
});

/* POST chats listing. */
router.post("/api/chat/create", async function (req, res) {
    let idItem = req.body._id;
    let currentUserId = res.locals.currentUser._id;

    // buscar algun chat de ese item donde haya mensajes de ese usuario
    let filter = {
        "item._id": idItem,
        "messages": {
            $elemMatch: {
                "user._id": currentUserId
            }
        }
    };

    let chat = await chatsService.findOne(filter);

    // sino existe crear uno nuevo
    if (!chat) {
        let item = await itemsService.findOne({
            _id: idItem
        });

        chat = {
            messages: [],
            item: item
        };

        chat = await chatsService.createChat(chat);
        if (chat === null) {
            return error(res, "create", 500);
        }
    }

    res.status(200);
    return res.json(chat);
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
