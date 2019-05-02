const path = require('path');
const app = require(path.join(__basedir, "app"));
let router = global.express.Router();

let rest = require("request");

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

    let configuration = {
        url: app.get('url') + '/api/user/' + currentUser._id,
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": req.session.token
        }
    };

    await rest(configuration, await function (err, response, body) {
        let user = JSON.parse(body);
        if (err || user.error) {
            req.session.error = user.error;
        }

        res.locals.currentUser = user;
        next();
    });
});

app.use("/success", router);
app.use("/home", router);
app.use("/admin/*", router);
app.use("/item/**", router);
app.use("/user/**", router);
app.use("/chat/**", router);
