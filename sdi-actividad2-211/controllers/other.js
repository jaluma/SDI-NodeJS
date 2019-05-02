const path = require('path');
const app = require(path.join(__basedir, "app"));

let router = global.express.Router();
const rest = require('./util/rest_call');
const error_control = require('./util/error_control');

router.get('/', function (req, res) {
    if (req.session.currentUser) {
        res.redirect('/home');
    }

    res.render('index');
});
router.get('/home', async function (req, res) {
    let request = error_control(req);
    // añadir lista de mis compras y destacados
    await rest({
        url: '/api/item/list',
        method: "GET",
        req: req,
        res: res,
        body: {
            filter: {
                "sellerUser._id": req.session.currentUser._id
            }
        },
        error: '/home',
        success: async function (result) {
            let ret = {
                itemsList: result.array,
                totalPages: result.pages,
                error: request.error
            };

            await rest({
                url: '/api/item/list',
                method: "GET",
                req: req,
                res: res,
                body: {
                    filter: {
                        highlighter: true
                    }
                },
                error: '/home',
                success: async function (result2) {
                    ret.hightlighter_items = result2.array.filter(i => i.sellerUser._id !== req.session.currentUser._id);
                    res.render('home', ret);
                }
            });
        }
    });
});

module.exports = router;

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
