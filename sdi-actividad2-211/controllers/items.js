const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
let rest = require("request");

/* GET items listing. */
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

router.get('/item/delete/:id', function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    let configuration = {
        url: app.get('url') + '/api/item/delete/' + id,
        method: "delete",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        return res.redirect("/item/mylist");
    });
});

router.get('/item/buy/:id', function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    let configuration = {
        url: app.get('url') + '/api/item/buy/' + id,
        method: "put",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        return res.redirect("/item/mylist");
    });
});

router.get('/item/highlighter/:id', function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    let configuration = {
        url: app.get('url') + '/api/item/highlighter/' + id,
        method: "put",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        return res.redirect("/item/mylist");
    });
});

router.get('/item/list', function (req, res) {
    let page = req.query.page || 1;
    let searchText = req.query.searchText;
    let error = req.session.error;
    if (error) {
        req.session.error = null;
    }

    let filter = {
        page: page,
        filter: {
            "sellerUser._id": {
                $ne: req.session.currentUser._id
            }
        }
    };

    if (searchText) {
        filter.filter.title = {
            $regex: ".*" + searchText + ".*",
            $options: 'i'
        }
    }

    let configuration = {
        url: app.get('url') + '/api/item/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify(filter)
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
            return res.redirect("/home");
        }

        body = JSON.parse(body);
        res.render('item/list', {
            itemsList: body.array,
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

/* POST items listing. */
router.post('/item/add', function (req, res) {
    let item = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        price: req.body.price,
        highlighter: req.body.highlighter === 'on',
        sellerUser: req.session.currentUser,
    };

    let configuration = {
        url: app.get('url') + '/api/item/add',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify(item)
    };

    rest(configuration, function (err, response, body) {
        let er = JSON.parse(body).error;
        if (err || er) {
            req.session.error = er;
        }

        return res.redirect("/item/mylist");
    });
});

module.exports = router;
