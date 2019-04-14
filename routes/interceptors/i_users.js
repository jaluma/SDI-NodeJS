let app = require('../../app');
let router = global.express.Router();

router.use(async function (req, res, next) {
    let token = req.session.token || res.locals.token;
    let currentUser = req.session.currentUser || res.locals.currentUser;
    if (!token || !currentUser) {
        return res.redirect('/login');
    }

    await app.get('jwt').verify(token, app.get('encrypt'), await function (err, request) {
        if (err || (Date.now() / 1000 - request.tiempo) > 240) {
            return res.redirect('/login');
        }
        res.locals.currentUser = currentUser;
        res.locals.token = token;
        next();
    });
});

app.use("/home", router);
app.use("/admin/*", router);
