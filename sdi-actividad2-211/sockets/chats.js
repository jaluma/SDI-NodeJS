const path = require('path');
let app = require(path.join(__basedir, "app"));
let debug = require('debug')('sdi-actividad2-211:server');
let rest = require("request");

let usersService = require(path.join(__basedir, "modules/services/users"));

module.exports = async function (io) {
    let connection = await io.on('connection', onConnect);
    app.set('socket', connection);
    app.set('io', io);

    async function onConnect(socket) {
        debug('[SOCKET] Listening on ' + app.get('port'));

        socket.on('init', async (data) => {
            socket.user = await usersService.findOne({
                email: data.email
            });
            socket.chat = data.chatId;
            socket.token = data.token;

            socket.join(socket.chat);
            socket.join(socket.user._id)
        });

        socket.on('receive_message', async (data) => {
            io.to(socket.chat).emit('receive_message', {
                message: data.message,
                user: data.user,
            });
            if (message.read) {
                io.to(data.user._id).emit('read_messages_mine', {
                    chat: data
                });
            }
        });

        socket.on('viewed_messages', async (data) => {
            let chat = data.chat;
            let currentUser = socket.user;

            let configuration = {
                url: app.get('url') + '/api/messages/read',
                method: "post",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "token": socket.token
                },
                body: JSON.stringify({
                    chat: chat,
                    currentUser: currentUser
                })
            };

            rest(configuration, function (err, response, body) {
                io.to(socket.chat).emit('read_messages_other', {
                    chat: data
                });
            });
        });

        socket.on('read_messages', async (data) => {
            let messages = data.chat.messages;
            let otherUser = messages.filter(m => m.user._id !== socket.user._id)[0].user;

            io.to(otherUser._id).emit('read_messages_mine', {
                chat: data
            });
        });

        socket.on('new_message', async (data) => {
            let chat = {
                _id: socket.chat
            };

            let message = {
                message: data.message,
                user: data.user,
                date: new Date().toISOString(),
                read: false
            };

            let configuration = {
                url: app.get('url') + '/api/messages/send',
                method: "post",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "token": socket.token
                },
                body: JSON.stringify({
                    message: message,
                    chat: chat,
                    currentUser: socket.user
                })
            };

            rest(configuration, function (err, response, body) {
            });

        });
    }
};
