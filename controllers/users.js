const app = require('../app');

let router = global.express.Router();
let rest = require("request");

/* GET users listing. */
router.get('/login', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    res.render('login', request);
});

router.get('/signup', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    res.render('signup', request);
});

router.get('/logout', function (req, res) {
    req.session.currentUser = null;
    res.redirect("/");
});

router.get('/success', function (req, res) {
    res.redirect('/home');
});

router.get('/user/details/:id', function (req, res) {
    let request = {};
    let error = req.session.error;
    if (error) {
        request = {error: error};
        req.session.error = null;
    }

    let configuration = {
        url: app.get('url') + '/api/user/list',
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        },
        body: JSON.stringify({
            filter: {
                _id: req.params.id
            }
        })
    };

    rest(configuration, function (err, response, body) {
        let error = JSON.parse(body).error;
        if (err || error) {
            req.session.error = error;
            return res.redirect("/home");
        }

        request.user = JSON.parse(body).array[0];
        res.render('user/details', request);
    });
});


/* POST users listing. */
router.post('/login', function (req, res) {
    let filter = {
        email: req.body.email,
        password: req.body.password
    };

    let configuration = {
        url: app.get('url') + '/api/login',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(filter)
    };

    rest(configuration, function (err, response, body) {
        let error = JSON.parse(body).error;
        if (err || error) {
            req.session.error = error;
            return res.redirect("/login");
        }

        req.session.currentUser = JSON.parse(body).user;
        req.session.token = JSON.parse(body).token;
        res.redirect("/success");
    });
});

router.post('/signup', async function (req, res) {
    let user = {
        email: req.body.email,
        name: req.body.name,
        lastName: req.body.lastName,
        fullName: req.body.name + " " + req.body.lastName,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    };

    let configuration = {
        url: app.get('url') + '/api/signup',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(user)
    };

    await rest(configuration, await function (err, response, body) {
        let error = JSON.parse(body).error;
        if (err || error) {
            req.session.error = error;
            return res.redirect("/signup");
        }

        req.session.currentUser = JSON.parse(body).user;
        req.session.token = JSON.parse(body).token;
        res.redirect('/success')
    });
});

module.exports = router;
