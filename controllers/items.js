const app = require('../app');

let router = global.express.Router();
let rest = require("request");

/* GET users listing. */

router.get('/item/add', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    request.now = new Date();
    res.render('item/add', request);
});

router.get('/item/details/:id', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    let configuration = {
        url: app.get('url') + '/api/item/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            _id: req.params.id
        })
    };

    rest(configuration, function (err, response, body) {
        let error = JSON.parse(body).error;
        if (err || error) {
            req.session.error = error;
            return res.redirect("/item/list");
        }

        request.item = JSON.parse(body)[0];
        res.render('item/details', request);
    });
});

router.get('/item/list', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    let configuration = {
        url: app.get('url') + '/api/item/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    };

    rest(configuration, function (err, response, body) {
        let error = JSON.parse(body).error;
        if (err || error) {
            req.session.error = error;
            return res.redirect("/home");
        }

        request.itemsList = JSON.parse(body);
        res.render('item/list', request);
    });
});

module.exports = router;
