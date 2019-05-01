const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
let rest = require("request");

/* GET users listing. */
router.get('/chat/list', async function (req, res) {
    let page = req.query.page || 1;

    let configuration = {
        url: app.get('url') + '/api/chat/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify({
            filter: {
                messages: {
                    $elemMatch: {
                        "user._id": req.session.currentUser._id
                    }
                }
            },
            page: page
        })
    };

    await rest(configuration, await function (err, response, body) {
        body = JSON.parse(body);

        if (!body.array) {
            res.redirect()
        }

        body.array.forEach(async c => {
            // emails contrarios
            c.otherUser = c.item.sellerUser;

            if (c.otherUser._id === req.session.currentUser._id) {
                for (let index in c.messages) {
                    let m = c.messages[index];
                    if (m.user != null && c.otherUser._id !== m.user._id) {
                        c.otherUser = m.user;
                        return;
                    }
                }
            }
            // count
            c.notRead = 0;

            for (let index in c.messages) {
                let m = c.messages[index];
                if (m.read === false) {
                    c.notRead++;
                }
            }
        });


        res.render('chat/list', {
            chatsList: body.array,
            actual: page,
            totalPages: body.pages
        });
    });
});

router.get('/chat/create/:id', async function (req, res) {
    let configuration = {
        url: app.get('url') + '/api/chat/create',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify({
            _id: req.params.id,
            currentUser: {
                _id: req.session.currentUser._id
            }
        })
    };

    await rest(configuration, await function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        body = JSON.parse(body);

        return res.redirect("/chat/conversation/" + body._id);
    });
});

router.get('/chat/conversation/:id', async function (req, res) {
    let id = req.params.id;

    let configuration = {
        url: app.get('url') + '/api/chat/' + id,
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    await rest(configuration, await function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            if (err === "list") {        // no existe
                return res.redirect('/chat/create/' + id);
            }
            req.session.error = er;
        }

        let chat = JSON.parse(body);

        res.locals.moment = require('moment');
        res.locals.moment.locale(app.get('i18n').getLocale());

        res.render('chat/conversation', {
            chat: chat
        });
    });
});

router.get('/chat/delete/:id', async function (req, res) {
    let id = req.params.id;

    let configuration = {
        url: app.get('url') + '/api/chat/delete/' + id,
        method: "delete",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    await rest(configuration, await function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        return res.redirect("/chat/list");
    });
});

/* POST users listing. */


module.exports = router;
