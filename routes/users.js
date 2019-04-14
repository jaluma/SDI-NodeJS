const app = require('../app');

let router = global.express.Router();
let rest = app.get("rest");

/* GET users listing. */
router.get('/login', function (req, res) {
    let request = {};
    if (req.session.error !== null) {
        request = {error: req.session.error};
    }

    res.render('login', request);
});

router.get('/signup', function (req, res) {
    res.render('signup');
});

router.get('/logout', function (req, res) {
    req.session.currentUser = null;
    res.redirect("/");
});

router.get('/success', function (req, res) {
    res.redirect('/home');
});

/* POST users listing. */
router.post('/login', function (req, res) {
    let secPassword = app.get('crypto').createHmac('sha256', app.get('encrypt')).update(req.body.password).digest('hex');
    let filter = {
        email: req.body.email,
        password: secPassword
    };

    let configuracion = {
        url: app.get('url') + '/api/user/login',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: filter
    };

    rest(configuracion, function (err, response, body) {
        if (err) {
            req.session.error = err;
            return res.redirect("/login");
        }

        req.session.currentUser = JSON.parse(body).user;
        res.redirect("/success");
    });

    // superagent
    //     .post(app.get('url') + '/api/user/login')
    //     .send(filter) // sends a JSON post body
    //     .set('accept', 'json')
    //     .end((err, response) => {
    //         if (err) {
    //             req.session.error = err;
    //             return res.redirect("/login");
    //         }
    //
    //         req.session.currentUser = JSON.parse(response.text).user;
    //         res.redirect("/success");
    //     });
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

    let configuracion = {
        url: app.get('url') + '/api/signup',
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: user
    };

    await rest(configuracion, await function (err, response, body) {
        if (err) {
            return res.redirect("/signup");
        }

        req.session.currentUser = JSON.parse(body);
        res.redirect('/success')
    });
});

module.exports = router;
