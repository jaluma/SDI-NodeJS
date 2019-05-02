module.exports = function error(res, param, status = 400) {
    res.status(status);
    return res.json({error: param});
};
