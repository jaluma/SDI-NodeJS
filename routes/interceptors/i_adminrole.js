let app = require('../../app');
let router = global.express.Router();
let createError = require('http-errors');

router.use(async function (req, res, next) {
    let currentUser = req.session.currentUser || res.locals.currentUser;
    if (!currentUser) {
        return res.redirect('/login');
    }

    if (currentUser.role === "ADMIN_ROLE") {
        return next();
    }

    next(createError(403));
});

app.use("/admin/*", router);
app.use("/user/details/*", router);
