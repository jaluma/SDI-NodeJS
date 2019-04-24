const path = require('path');
const app = require(path.join(__basedir, "app"));

const router = global.express.Router();

// services
let messagesService = require(path.join(__basedir, "modules/services/messages"));
let chatsService = require(path.join(__basedir, "modules/services/chats"));
let usersService = require(path.join(__basedir, "modules/services/users"));

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

    let message = req.body.message;
    let chat = req.body.chat;
    let currentUser = req.body.currentUser;

    message.user = await usersService.findOne(currentUser);
    message = await messagesService.addMessage(message);
    await chatsService.updateChat(chat, {
        messages: message
    });

    let send = {
        message: message,
        user: currentUser,
        chat: chat
    };

    await app.get('io').sockets.emit('receive_message', send);

    res.status(200);
    return res.json(message);
});

router.post("/api/messages/read", async function (req, res) {
    let body = req.body;
    if (body.chat === null) {
        return error(res, "chat");
    }
    if (body.currentUser === null) {
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

    app.get('io').sockets.emit('read_messages', {
        chat: chat,
        currentUser: currentUser
    });

    res.status(200);
    return res.json({
        count: count
    });
});

module.exports = router;

function error(res, param, status = 442) {
    res.status(status);
    return res.json({error: param});
}
