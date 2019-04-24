const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rest = require('request');
const jwt = require('jsonwebtoken');
const expressSession = require('express-session');
const swig = require('swig');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const i18n = require('i18n');

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
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
app.use(logger('dev'));
app.use(logger('common', {
    stream: fs.createWriteStream('./application.log', {
        flags: 'a'
    })
}));
// post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//internatization
i18n.configure({
    locales: ['es', 'en'],
    directory: __dirname + '/i18n',
    defaultLocale: 'es',
    queryParameter: 'lang',
    objectNotation: true,
    api: {
        '__': 'translate',
        '__n': 'translateN'
    },
});

app.use(function (req, res, next) {
    res.locals.__ = res.__ = function () {
        return i18n.__.apply(req, arguments);
    };
    next();
});

app.use(i18n.init);

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
app.set('i18n', i18n);

app.set('url', "https://localhost:8081");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = app;

// interceptors
require("./routes/interceptors/i_login");
require("./routes/interceptors/i_adminrole");
require("./routes/interceptors/i_standardrole");
require("./routes/interceptors/i_api_users");

// api
app.use(require("./routes/api/api_users"));
app.use(require("./routes/api/api_items"));
app.use(require("./routes/api/api_chats"));
app.use(require("./routes/api/api_messages"));

// routes
app.use(require("./controllers/users"));
app.use(require("./controllers/admins"));
app.use(require("./controllers/items"));
app.use(require("./controllers/chats"));

app.use(require("./controllers/other"));


