const path = require('path');
const app = require(path.join(__basedir, "app"));
let router = global.express.Router();
let createError = require('http-errors');

router.use(async function (req, res, next) {
    let currentUser = req.session.currentUser || res.locals.currentUser;
    if (!currentUser) {
        return res.redirect('/login');
    }

    if (currentUser.role === "STANDARD_ROLE") {
        return next();
    }

    next(createError(403));
});

app.use("/item/**", router);
app.use("/chat/**", router);
