module.exports = {
    home: function (app) {
        app.get('/', function (req, res) {
            res.render('index');
        });
        app.get('/home', function (req, res) {
            // añadir lista de destacados
            res.render('home');
        });
    },
    error: function (app) {
        // catch 404 and forward to error handler
        app.get(function (req, res, next) {
            let createError = require('http-errors');
            next(createError(404));
        });

        app.get(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
};
