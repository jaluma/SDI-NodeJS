const path = require('path');
const app = require(path.join(__basedir, "app"));
let router = global.express.Router();

const rest = require(path.join(__basedir, "routes/util/rest_call"));

router.use(async function (req, res, next) {
    let token = req.session.token || res.locals.token;
    let currentUser = req.session.currentUser || res.locals.currentUser;
    if (!token || !currentUser) {
        req.session.lastPage = req.originalUrl;
        return res.redirect('/login');
    }

    await app.get('jwt').verify(token, app.get('encrypt'), await function (err, request) {
        if (err || (Date.now() / 1000 - request.time) > 240) {
            req.session.lastPage = req.originalUrl;
            return res.redirect('/login');
        }
        res.locals.currentUser = currentUser;
        res.locals.token = token;
        next();
    });
});

router.use(async function (req, res, next) {
    let currentUser = res.locals.currentUser;

    await rest({
        url: '/api/user/' + currentUser._id,
        method: "GET",
        req: req,
        res: res,
        error: '/home',
        success: await function (result) {
            res.locals.currentUser = result;
            next();
        }
    });
});

app.use("/success", router);
app.use("/home", router);
app.use("/admin/*", router);
app.use("/item/**", router);
app.use("/user/**", router);
app.use("/chat/**", router);
