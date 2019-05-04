const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
const rest = require(path.join(__basedir, "routes/util/rest_call"));
const error_control = require(path.join(__basedir, "routes/util/error_control"));

/* GET users listing. */
router.get('/chat/list', async function (req, res) {
    let page = req.query.page || 1;

    await rest({
        url: '/api/chat/mylist/' + page,
        method: "GET",
        req: req,
        res: res,
        error: '/home',
        success: await function (result) {
            result.array.forEach(async c => {
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
                chatsList: result.array,
                actual: page,
                totalPages: result.pages
            });
        }
    });

});

router.get('/chat/create/:id', async function (req, res) {
    await rest({
        url: '/api/chat/create',
        method: "POST",
        req: req,
        res: res,
        body: {
            _id: req.params.id,
        },
        error: '/chat/list',
        success: await function (result) {
            return res.redirect("/chat/conversation/" + result._id);
        }
    });
});

router.get('/chat/conversation/:id', async function (req, res, next) {
    let id = req.params.id;

    await rest({
        url: '/api/chat/' + id,
        method: "GET",
        req: req,
        res: res,
        next: next,
        error: '/chat/list/',
        success: await function (result) {
            let chat = result;

            res.locals.moment = require('moment/moment');
            let locale = app.get('i18n').getLocale();
            let str = locale.toString();
            res.locals.moment.locale(str);

            res.render('chat/conversation', {
                chat: chat
            });
        }
    });
});

router.get('/chat/delete/:id', async function (req, res) {
    let id = req.params.id;

    await rest({
        url: '/api/chat/delete/' + id,
        method: "DELETE",
        req: req,
        res: res,
        error: '/chat/list/',
        success: await function (result) {
            return res.redirect("/chat/list");
        }
    });
});

/* POST users listing. */


module.exports = router;
