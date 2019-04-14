const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rest = require('request');
const jwt = require('jsonwebtoken');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload');
const swig = require('swig');
const bodyParser = require('body-parser');
const i18n = require("i18n-express");
const geolang = require("geolang-express");
const csrf = require('csurf');
const crypto = require('crypto');
const mongo = require('mongodb');

global.express = express;
global.__basedir = __dirname;

const app = express();

// config
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
// app.use(csrf({ cookie: true }));
// app.use(function (req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.locals.csrftoken = req.csrfToken();
//     next();
// });
// post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//internatization
app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ["en", "es"],
    textsVarName: 'translation',
    paramLangName: "lang",
    defaultLocale: "es",
}));
app.use(geolang({
    siteLangs: ["en", "es"],
    cookieLangName: 'lang'
}));

// view engine setup
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({cache: false});

// save app variables
app.set('rest', rest);
app.set('jwt', jwt);
app.set('encrypt', "javi");
app.set('crypto', crypto);
app.set('mongo', mongo);

app.set('url', "https://localhost:8081");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = app;

// interceptors
require("./routes/interceptors/i_users");
require("./routes/interceptors/i_api_users");

// api
app.use(require("./routes/api/user/api_users"));

// routes
app.use(require("./controllers/user/users"));
app.use(require("./controllers/admin/admins"));

const rother = require("./controllers/other");
rother.home(app);
rother.error(app);
