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

    socket.on("read_messages_mine", () => {
        $('.read_message[class*="right"]').html('<i class=\"material-icons\">done_all</i>');
    });

    socket.on("read_messages_other", () => {
        $('.read_message[class*="left"]').html('<i class=\"material-icons\">done_all</i>');
    });

    socket.on("receive_message", (data) => {
        if (data.chat._id === chatId) {
            let copy = $('#copy').find('#message').clone();
            copy.find('#username_data').text(data.message.user.fullName);
            copy.find('#time_data').text(moment(data.message.time).format('lll'));
            copy.find('#message_text').text(data.message.message);
            if (data.message.read) {
                copy.find('#read_text').html("<i class=\"material-icons\">done_all</i>");
            } else {
                copy.find('#read_text').html("<i class=\"material-icons\">done</i>");
            }

            if (email.text() === data.message.user.email) {
                copy.find('.message-data').addClass("my-message-data");
                copy.find('.message').addClass("my-message");
                copy.find('#read_text').addClass("right");
            } else {
                copy.find('.message-data').addClass("other-message-data");
                copy.find('.message').addClass("other-message");
                copy.find('#read_text').addClass("left");

                // he leido su mensaje
                socket.emit('viewed_messages', {
                    chat: {
                        _id: data.chat._id
                    },
                    user: {
                        email: email.text()
                    }
                });
            }

            if (chatroom.children().length > 0) {
                copy.insertAfter(chatroom.children().last());
            } else {
                chatroom.html(copy);
            }

            init();
        }
    });

    // he leido todos sus mensajes
    socket.emit('viewed_messages', {
        chat: {
            _id: chatId
        },
        user: {
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
