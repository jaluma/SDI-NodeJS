const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rest = require('request');
const jwt = require('jsonwebtoken');
const expressSession = require('express-session');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
const mongo = require('mongodb');
const swig = require('swig');
const bodyParser = require('body-parser');
const i18n = require("i18n-express");
const geolang = require("geolang-express");

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
app.set('db', '');
app.set('dbPassword', 'abcdefg');
app.set('crypto', crypto);

// routes
const rother = require("./routes/rother");
rother.home(app);
rother.error(app);

module.exports = app;
