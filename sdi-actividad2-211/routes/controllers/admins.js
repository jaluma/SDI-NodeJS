const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
const rest = require(path.join(__basedir, "routes/util/rest_call"));
const error_control = require(path.join(__basedir, "routes/util/error_control"));

/* GET users listing. */
router.get('/admin/list', async function (req, res) {
    let page = req.query.page || 1;

    await rest({
        url: '/api/user/list',
        method: "POST",
        req: req,
        res: res,
        body: {
            page: page
        },
        error: '/home',
        success: await function (result) {
            res.render('admin/list', {
                usersList: result.array,
                actual: page,
                totalPages: result.pages
            });
        }
    });

});

router.get('/admin/logging', async function (req, res) {
    res.download('./application.log', 'app.log');
});

/* POST users listing. */
router.post('/admin/remove', async function (req, res) {
    if (req.body.checkbox === null) {
        res.redirect('/admin/list');
    }

    let list = req.body.checkbox;
    if (Array.isArray(list) === false) {
        list = [];
        list.push(req.body.checkbox);
    }

    for (let c in list) {
        if (list.hasOwnProperty(c)) {
            let check = list[c];

            await rest({
                url: '/api/user/delete/' + check,
                method: "DELETE",
                req: req,
                res: res,
                error: '/admin/list'
            });
        }
    }

    res.redirect('/admin/list');
});

module.exports = router;
