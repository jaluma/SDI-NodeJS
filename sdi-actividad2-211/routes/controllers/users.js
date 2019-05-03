const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
const rest = require(path.join(__basedir, "routes/util/rest_call"));
const error_control = require(path.join(__basedir, "routes/util/error_control"));

/* GET users listing. */
router.get('/login', function (req, res) {
    let request = error_control(req);
    res.render('login', request);
});

router.get('/signup', function (req, res) {
    let request = error_control(req, app.get("i18n").__("error.signup." + req.session.error));

    res.render('signup', request);
});

router.get('/logout', function (req, res) {
    delete req.session.lastPage;
    delete req.session.currentUser;

    res.redirect("/login");
});

router.get('/user/details/:id', function (req, res) {
    let request = error_control(req);

    if (!req.params.id) {
        res.redirect('/home');
    }

    rest({
        url: '/api/user/' + req.params.id,
        method: "GET",
        req: req,
        res: res,
        error: '/home',
        success: function (result) {
            request.user = result;
            res.render('user/details', request);
        }
    });
});

router.get('/user/purchases', function (req, res) {
    let page = req.query.page || 1;
    let request = error_control(req);

    rest({
        url: '/api/item/purchases/' + page,
        method: "GET",
        req: req,
        res: res,
        error: '/home',
        success: function (result) {
            res.render('user/purchases', {
                itemsList: result.array,
                actual: page,
                totalPages: result.pages,
                error: request.error
            });
        }
    });
});

/* POST users listing. */
router.post('/login', async function (req, res) {
    await rest({
        url: '/api/login',
        method: "POST",
        req: req,
        res: res,
        body: {
            email: req.body.email,
            password: req.body.password
        },
        error: '/login',
        success: await function (result) {
            saveCurrentUser(req, result);

            let page = req.session.lastPage;
            if (page && req.session.currentUser && req.session.token) {
                delete req.session.lastPage;
                return res.redirect(page);
            }

            res.redirect('/home');
        }
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

    rest({
        url: '/api/signup',
        method: "POST",
        req: req,
        res: res,
        body: user,
        error: '/signup',
        success: function (result) {
            saveCurrentUser(req, result);

            res.redirect('/home');
        }
    });
});

module.exports = router;

function saveCurrentUser(req, body) {
    req.session.currentUser = body.user;
    req.session.currentUser.money = req.session.currentUser.money.toFixed(2);
    req.session.token = body.token;
}
