module.exports = function (req, errorString) {
    let error = req.session.error;
    if (!error) {
        return {};
    }
    delete req.session.error;
    let errorStr = errorString || error;
    return {
        error: errorStr
    };
};
