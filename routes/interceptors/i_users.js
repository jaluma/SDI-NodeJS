let app = require('../../app');
let router = global.express.Router();

router.use(function (req, res, next) {
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (!token) {
        return res.redirect('/login');
    }

    let currentUser = req.headers['user'] || req.body.user || req.query.user;
    app.get('jwt').verify(token, app.get('encrypt'), function (err, request) {
        if (err || (Date.now() / 1000 - request.tiempo) > 240) {
            return res.redirect('/login');
        }
        res.currentUser = currentUser;
        next();
    });
});

app.use("/home", router);
app.use("/admin/**", router);

