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
        });

        socket.on('receive_message', async (data) => {
            io.to(socket.chat).emit('receive_message', {
                message: data.message,
                user: data.user,
            });
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

            await rest(configuration, function (err, response, body) {
            });
        });

        socket.on('read_messages', async (data) => {
            let red = 'read_messages_other';
            if (data.currentUser === socket.user) {
                red = 'read_messages_mine';
            }

            io.to(socket.chat).emit(red, {
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

            await rest(configuration, function (err, response, body) {
            });

        });
    }
};