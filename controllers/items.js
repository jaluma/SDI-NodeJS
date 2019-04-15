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
            "token": req.session.token
        },
        body: JSON.stringify({
            _id: req.params.id
        })
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
            return res.redirect("/item/list");
        }

        request.item = JSON.parse(body).array[0];
        res.render('item/details', request);
    });
});

router.get('/item/list', function (req, res) {
    let page = req.query.page || 1;
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
            page: page
        })
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
            return res.redirect("/home");
        }

        body = JSON.parse(body);
        res.render('item/list', {
            itemsList: body.array.filter(i => i.sellerUser._id !== req.session.currentUser._id),
            actual: page,
            totalPages: body.pages,
            error: error
        });
    });
});

router.get('/item/mylist', function (req, res) {
    let page = req.query.page || 1;
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
            filter: {"sellerUser._id": req.session.currentUser._id},
            page: page
        })
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
            return res.redirect("/item/mylist");
        }

        body = JSON.parse(body);
        res.render('item/mylist', {
            itemsList: body.array,
            actual: page,
            totalPages: body.pages,
            error: error
        });
    });
});

module.exports = router;
