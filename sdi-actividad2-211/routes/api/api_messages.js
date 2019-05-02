const path = require('path');
const app = require(path.join(__basedir, "app"));

const router = global.express.Router();
const error = require('./util/api_error');

// services
let messagesService = require(path.join(__basedir, "modules/services/messages"));
let chatsService = require(path.join(__basedir, "modules/services/chats"));
let usersService = require(path.join(__basedir, "modules/services/users"));

/* GET items listing. */
router.get("/api/messages/not_readed/:id", async function (req, res) {
    let filter = {
        _id: req.params.id,
        messages: {
            $elemMatch: {
                read: {
                    $ne: true
                }
            }
        }
    };

    let chat = await chatsService.findOne(filter);
    if (chat === null) {
        return error(res, "list");
    }

    res.status(200);
    return res.json({
        count: chat.messages.length
    });
});

/* POST chats listing. */
router.post("/api/messages/send", async function (req, res) {
    if (req.body.message === null) {
        return error(res, "message");
    }
    if (req.body.chat === null) {
        return error(res, "chat");
    }
    if (req.body.currentUser === null) {
        return error(res, "user");
    }

    let chat = {
        _id: req.body.chat
    };

    let currentUser = {
        email: req.body.currentUser
    };
    let user = await usersService.findOne(currentUser);

    let message = {
        message: req.body.message,
        time: new Date(),
        read: false,
        user: user
    };

    message = await messagesService.addMessage(message);
    await chatsService.updateChat(chat, {
        messages: message
    });

    let send = {
        message: message,
        user: user,
        chat: chat
    };

    app.get('io').sockets.emit('receive_message', send);

    res.status(200);
    return res.json(message);
});

router.post("/api/messages/read", async function (req, res) {
    let body = req.body;
    if (!body.chat) {
        return error(res, "chat");
    }
    if (!body.currentUser) {
        return error(res, "user");
    }

    let chat = body.chat;
    let currentUser = body.currentUser;
    let status = body.status || true;

    currentUser = await usersService.findOne(currentUser);
    chat = await chatsService.findOne(chat);

    if (!currentUser || !chat) {
        return error(res, "find");
    }

    let currentUserF = {
        _id: currentUser._id.toString()
    };

    let count = 0;
    for (let index in chat.messages) {
        let message = chat.messages[index];
        if (message.read) {
            continue;
        }

        if (currentUserF._id === message.user._id.toString()) {
            continue;
        }

        let filter = {
            messages: {
                $elemMatch: {
                    _id: message._id.toString()

                }
            }
        };

        let result = await chatsService.updateChat(filter, {
            "messages.$.read": status
        }, 'set');
        count += result.modifiedCount;

        chat.messages[index].read = status;
    }

    if (count > 0) {
        let messages = chat.messages;
        let otherUser = messages.filter(m => m.user._id.toString() !== currentUser._id.toString())[0].user;

        app.get('io').to(otherUser._id.toString()).emit('read_messages_mine', {
            chat: chat
        });
        app.get('io').to(currentUser._id.toString()).emit('read_messages_other', {
            chat: chat
        });
        app.get('io').to(chat._id).emit('read_messages_list', {
            chat: chat,
            count: count
        });
    }

    res.status(200);
    return res.json({
        count: count
    });
});

module.exports = router;
