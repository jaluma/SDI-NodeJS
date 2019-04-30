$(function () {
    let socket = io.connect('http://localhost:8081', {secure: true});

    let email = $("#currentUser");
    let token = $("#token");
    let chat = $("#chatId");

    let message = $("#messageInput");
    let send_message = $("#sendButton");
    let chatroom = $("#messages");

    let urlSplit = window.location.href.split('/');
    let chatId = urlSplit[urlSplit.length - 1];

    socket.emit('init', {
        email: email.text(),
        chatId: chat.text(),
        token: token.text()
    });

    send_message.click(() => {
        socket.emit('new_message', {
            message: message.val(),
            user: email.text(),
            chat: chat.text()
        });
        message.val('');
    });

    socket.on("read_messages_mine", (data) => {
        $('.read_message[class*="right"]').text('Leido');
    });

    socket.on("read_messages_other", (data) => {
        $('.read_message[class*="left"]').text('Leido');
    });

    socket.on("receive_message", (data) => {
        if (data.chat._id === chatId) {
            let copy = $('#copy').find('#message').clone();
            copy.find('#username_data').text(data.message.user.fullName);
            copy.find('#time_data').text(moment(data.message.time).format('lll'));
            copy.find('#message_text').text(data.message.message);
            copy.find('#read_text').text(data.message.read ? "Leído" : "No leido");

            if (email.text() === data.message.user.email) {
                copy.find('.message-data').addClass("my-message-data");
                copy.find('.message').addClass("my-message");
                copy.find('#read_text').addClass("right");
            } else {
                copy.find('.message-data').addClass("other-message-data");
                copy.find('.message').addClass("other-message");
                copy.find('#read_text').addClass("left");
            }

            if (chatroom.children().length > 0) {
                copy.insertAfter(chatroom.children().last());
            } else {
                chatroom.html(copy);
            }

            init();
        }

        socket.emit('viewed_messages', {
            chat: {
                _id: data.chat._id
            },
            currentUser: {
                email: email.text()
            }
        });


    });

    socket.emit('viewed_messages', {
        chat: {
            _id: chatId
        },
        currentUser: {
            email: email.text()
        }
    });

    message.on('keypress', function (e) {
        if (e.which === 13) {
            $(this).attr("disabled", "disabled");
            $("#sendButton").click();
            $(this).removeAttr("disabled");
        }
    });

    init();

    function init() {
        chatroom.animate({
            scrollTop: chatroom.get(0).scrollHeight
        }, 2000);

        message.focus();
    }
});
