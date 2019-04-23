$(function () {
    let socket = io.connect('https://localhost:8081', {secure: true});

    let email = $("#currentUser");
    let chatId = $("#chatId");

    let message = $("#messageInput");
    let send_message = $("#sendButton");
    let chatroom = $("#messages");

    socket.emit('init', {
        email: email.text(),
        chatId: chatId.text()
    });

    send_message.click(() => {
        socket.emit('new_message', {
            message: message.val(),
            user: {
                email: email.text()
            }
        });
        message.val('');
    });

    socket.on("new_message", (data) => {
        let urlSplit = window.location.href.split('/');
        let chatId = urlSplit[urlSplit.length - 1];

        if (data.chat === chatId) {
            let copy = $('#copy').find('#message').clone();
            copy.find('#username_data').text(data.message.user.fullName);
            copy.find('#time_data').text(moment(data.message.date).format('lll'));
            copy.find('#message_text').text(data.message.message);

            if (data.user.email === data.message.user.email) {
                copy.find('.message-data').addClass("my-message-data");
                copy.find('.message').addClass("my-message");
            } else {
                copy.find('.message-data').addClass("other-message-data");
                copy.find('.message').addClass("other-message");
            }

            copy.insertAfter(chatroom.children().last());
            init();
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
