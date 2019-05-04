const path = require('path');
const app = require(path.join(__basedir, "app"));

let rest = require("request");
let createErrorHttp = require('http-errors');

module.exports = async function (config) {
    await restFunction(config.url, config.req, config.res, config.next, config.error, config.success, config.method, config.body, config.token);
};

async function restFunction(urlPath, req, res, next, urlError = '/home', callback = () => {
}, method = 'GET', body = {}, token = req.session.hasOwnProperty('token') ? req.session.token : undefined) {
    let configuration = {
        url: app.get('url') + urlPath,
        method: method,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token": token
        },
        body: isObject(body) ? JSON.stringify(body) : undefined
    };

    deleteUndefined(configuration);

    await rest(configuration, await function (err, response, result) {
        if (!res && !req) {
            return callback(result);
        }

        if (response.statusCode === 403) {  // forbidden
            return next(createErrorHttp(403));
        }

        if (isParseJSON(result)) {
            result = JSON.parse(result);
            if (result.error) {

                return createError(req, res, result.error, urlError);
            }
            if (callback) {
                return callback(result);
            }
        }
        if (err) {
            return createError(req, res, err, urlError);
        }
    });
}

/** AUXILIARES */
function isObject(str) {
    return (typeof str === 'object');
}

function isParseJSON(str) {
    try {
        let json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (e) {
        return false;
    }
}

function deleteUndefined(obj) {
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'undefined') {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            deleteUndefined(obj[key])
        }
    });
}

function createError(req, res, error, urlError) {
    req.session.error = error;
    return res.redirect(urlError);
}
