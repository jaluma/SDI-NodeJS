$(function () {
    let URL = window.location.protocol + "//" + window.location.host;
    let socket = io.connect(URL);

    let idChats = [];
    $("#tableChats tr").each(function () {
        idChats.push($(this).attr('id'));
    });

    socket.emit('init_list', {
        chats: idChats
    });

    socket.on("read_messages_list", (data) => {
        let column = 0;
        let cell = $('#' + data.chat._id).find('td').eq(column);
        cell.html(data.count);
    });

});
