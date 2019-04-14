const app = require('../app');
const superagent = require('superagent');

let router = global.express.Router();

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

    superagent
        .post(app.get('url') + '/api/user/login')
        .send(filter) // sends a JSON post body
        .set('accept', 'json')
        .end((err, response) => {
            if (err) {
                req.session.error = err;
                return res.redirect("/login");
            }

            req.session.currentUser = JSON.parse(response.text).user;
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

    superagent
        .post(app.get('url') + '/api/user/add')
        .send(user) // sends a JSON post body
        .set('accept', 'json')
        .end((err, response) => {
            if (err) {
                return res.redirect("/signup");
            }

            req.session.currentUser = JSON.parse(response.text);
            res.redirect('/success')
        });
});

module.exports = router;
