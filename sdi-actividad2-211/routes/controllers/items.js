const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
const rest = require(path.join(__basedir, "routes/util/rest_call"));
const error_control = require(path.join(__basedir, "routes/util/error_control"));

/* GET items listing. */
router.get('/item/add', function (req, res) {
    let request = error_control(req);
    request.now = new Date();

    res.render('item/add', request);
});

router.get('/item/details/:id', async function (req, res) {
    let request = error_control(req);

    if (!req.params.id) {
        res.status(400);
        res.redirect('/item/list');
    }

    await rest({
        url: '/api/item/' + req.params.id,
        method: "GET",
        req: req,
        res: res,
        body: {
            filter: {
                _id: req.params.id
            }
        },
        error: '/item/list/',
        success: await function (result) {
            request.item = result;
            res.render('item/details', request);
        }
    });
});

router.get('/item/delete/:id', async function (req, res, next) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    await rest({
        url: '/api/item/delete/' + id,
        method: "DELETE",
        req: req,
        res: res,
        next: next,
        error: '/item/mylist',
        success: await function (result) {
            return res.redirect("/item/mylist");
        }
    });
});

router.get('/item/buy/:id', async function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    await rest({
        url: '/api/item/buy/' + id,
        method: "PUT",
        req: req,
        res: res,
        error: '/item/list',
        success: await function (result) {
            return res.redirect("/user/purchases");
        }
    });
});

router.get('/item/highlighter/:id', async function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "item");
    }

    await rest({
        url: '/api/item/highlighter/' + id,
        method: "PUT",
        req: req,
        res: res,
        error: '/item/mylist',
        success: await function (result) {
            return res.redirect("/item/mylist");
        }
    });
});

router.get('/item/list', async function (req, res) {
    let page = req.query.page || 1;
    let searchText = req.query.searchText;

    let request = error_control(req);

    let filter = {
        filter: {
            "sellerUser._id": {
                $ne: req.session.currentUser._id
            }
        },
        page: page
    };

    if (searchText) {
        filter.filter.title = {
            $regex: ".*" + searchText + ".*",
            $options: 'i'
        }
    }

    await rest({
        url: '/api/item/list',
        method: "POST",
        req: req,
        res: res,
        body: filter,
        error: '/home',
        success: await function (result) {
            res.render('item/list', {
                itemsList: result.array,
                actual: page,
                totalPages: result.pages,
                error: request.error
            });
        }
    });
});

router.get('/item/mylist', async function (req, res) {
    let page = req.query.page || 1;
    let request = error_control(req);

    await rest({
        url: '/api/item/mylist/' + page,
        method: "GET",
        req: req,
        res: res,
        error: '/home',
        success: await function (result) {
            res.render('item/mylist', {
                itemsList: result.array,
                actual: page,
                totalPages: result.pages,
                error: request.error
            });
        }
    });
});

/* POST items listing. */
router.post('/item/add', async function (req, res) {
    let item = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        price: req.body.price,
        highlighter: req.body.highlighter === 'on',
        sellerUser: req.session.currentUser._id
    };

    await rest({
        url: '/api/item/add',
        method: "POST",
        req: req,
        res: res,
        body: item,
        error: '/item/mylist',
        success: await function (result) {
            return res.redirect("/item/mylist");
        }
    });
});

module.exports = router;
