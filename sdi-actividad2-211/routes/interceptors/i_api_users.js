const path = require('path');
const app = require(path.join(__basedir, "app"));
let router = global.express.Router();

router.use(function (req, res, next) {
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (!token) {
        res.status(403); // Forbidden
        return res.json({
            authenticated: false,
            error: 'no token'
        });
    }

    app.get('jwt').verify(token, app.get('encrypt'), function (err, request) {
        if (err || (Date.now() / 1000 - request.time) > 240) {
            res.status(403); // Forbidden
            return res.json({
                authenticated: false,
                error: 'invalid token'
            });
        }
        res.locals.currentUser = request.currentUser;
        next();
    });
});

app.use("/api/user/**", router);
app.use("/api/item/**", router);
app.use("/api/chat/**", router);
app.use("/api/messages/**", router);
