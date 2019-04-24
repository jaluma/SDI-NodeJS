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

    message.user = await usersService.findOne(message.user);
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

module.exports = router;

function error(res, param, status = 442) {
    res.status(status);
    return res.json({error: param});
}
