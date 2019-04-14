const app = require('../../app');

let router = global.express.Router();
let rest = require("request");

/* GET users listing. */
router.get('/admin/list', async function (req, res) {
    let configuration = {
        url: app.get('url') + '/api/user/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify({})
    };

    await rest(configuration, await function (err, response, body) {
        res.render('admin/list', {usersList: JSON.parse(body)});
    });
});

/* POST users listing. */
router.post('/admin/remove', async function (req, res) {
    let list = req.body.checkbox;
    if (Array.isArray(list) === false) {
        list = [];
        list.push(req.body.checkbox);
    }
    for (let c in list) {
        let check = list[c];
        let configuration = {
            url: app.get('url') + '/api/user/delete/' + check,
            method: "delete",
            headers: {
                "token": req.session.token
            }
        };

        await rest(configuration, await function (err, response, body) {
        });
    }
    res.redirect('/admin/list');
});

module.exports = router;
