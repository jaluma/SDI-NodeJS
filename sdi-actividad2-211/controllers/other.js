const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
let rest = require("request");

router.get('/', function (req, res) {
    if (req.session.currentUser) {
        res.redirect('/home');
    }

    res.render('index');
});
router.get('/home', async function (req, res) {
    // añadir lista de mis compras y destacados
    let error = req.session.error;
    if (error) {
        req.session.error = null;
    }

    let configuration = {
        url: app.get('url') + '/api/item/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify({
            filter: {
                "sellerUser._id": req.session.currentUser._id
            }
        })
    };

    await rest(configuration, async function (err, response, body) {
        body = JSON.parse(body);
        let ret = {
            itemsList: body.array,
            totalPages: body.pages,
            error: error
        };


        configuration = {
            url: app.get('url') + '/api/item/list',
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "token": req.session.token
            },
            body: JSON.stringify({
                filter: {
                    highlighter: true
                }
            })
        };

        await rest(configuration, await function (err, response, body) {
            ret.hightlighter_items = JSON.parse(body).array.filter(i => i.sellerUser._id !== req.session.currentUser._id);
            res.render('home', ret);
        });
    });
});

module.exports = router;

// // catch 404 and forward to error handler
// app.get(function (req, res, next) {
//     let createError = require('http-errors');
//     next(createError(404));
// });

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
