$(document).ready(function () {
    var messages = $('#messages');
    messages.animate({
        scrollTop: messages.get(0).scrollHeight
    }, 2000);
    $("#messageInput").focus();
});