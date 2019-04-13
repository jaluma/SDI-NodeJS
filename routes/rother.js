module.exports = {
    home: function (app) {
        app.get('/', function (req, res) {
            res.render('index');
        });
    },
    globalLocals: function (req, res, next) {
        res.locals({
            permission: require('permission'),
        });
        next();
    },
    error: function (app) {
        const createError = require('http-errors');
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });

        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
};
