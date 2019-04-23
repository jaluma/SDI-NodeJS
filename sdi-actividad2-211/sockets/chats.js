const path = require('path');
let app = require(path.join(__basedir, "app"));
let debug = require('debug')('sdi-actividad2-211:server');

let usersService = require(path.join(__basedir, "modules/services/users"));
let chatsService = require(path.join(__basedir, "modules/services/chats"));
let messagesService = require(path.join(__basedir, "modules/services/messages"));

module.exports = function (server) {
    const io = require("socket.io")(server);

    io.on('connection', (socket) => {
        debug('[SOCKET] Listening on ' + app.get('port'));
        socket.on('init', async (data) => {
            socket.user = await usersService.findOne({
                email: data.email
            });
            socket.chat = data.chatId;
        });

        socket.on('new_message', async (data) => {
            let filter = {
                _id: socket.chat
            };
            let message = {
                message: data.message,
                user: socket.user,
                date: new Date()
            };

            message = await messagesService.addMessage(message);

            await chatsService.updateChat(filter, {
                messages: message
            });

            io.sockets.emit('new_message', {
                message: message,
                user: data.user,
                chat: socket.chat
            });

            // añadir mensaje a la base de datos
        });
    });

    return io;
};
