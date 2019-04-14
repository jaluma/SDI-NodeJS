module.exports = async function (req, res, usersService, app, error) {
    if (req.body.email === null) {
        return error(res, "email");
    }

    usersService.findAllUsers({email: req.body.email}, (users) => {
        if (users !== null && users.length > 0) {
            return error(res, "email");
        }
    });

    if (req.body.password === null || req.body.passwordConfirm === null || req.body.password !== req.body.passwordConfirm) {
        res.status(422);
        return res.json({error: "password"});
    }

    if (req.body.name === null || req.body.name.length <= 0) {
        return error(res, "name");
    }

    if (req.body.lastName === null || req.body.lastName.length <= 0) {
        return error(res, "lastName");
    }
};
