const path = require('path');
const app = require(path.join(__basedir, "app"));

const router = global.express.Router();
const error = require(path.join(__basedir, "routes/api/util/api_error"));

// services
let usersService = require(path.join(__basedir, "modules/services/users"));

/* GET users listing. */
router.get("/api/user/:id", async function (req, res) {
    let id = req.params.id;
    if (id === null) {
        return error(res, "user");
    }

    let user = {
        _id: id
    };

    user = await usersService.findOne(user);
    if (user === null) {
        return error(res, "user");
    }

    res.status(200);
    res.json(user);
});

/* POST users listing. */
router.post("/api/signup", async function (req, res) {
    if (req.body.email === null) {
        return error(res, "email");
    }

    let users = await usersService.findAllUsers({email: req.body.email});
    if (users === null || users.length > 0) {
        return error(res, "email");
    }
    if (req.body.password === null || req.body.passwordConfirm === null || req.body.password !== req.body.passwordConfirm) {
        return error(res, "password");
    }
    if (req.body.name === null || req.body.name.length <= 0) {
        return error(res, "name");
    }
    if (req.body.lastName === null || req.body.lastName.length <= 0) {
        return error(res, "lastName");
    }

    let secPassword = app.get('crypto').createHmac('sha256', app.get('encrypt')).update(req.body.password).digest('hex');
    let user = {
        email: req.body.email,
        name: req.body.name,
        lastName: req.body.lastName,
        fullName: req.body.name + " " + req.body.lastName,
        password: secPassword,
        money: 100,
        role: "STANDARD_ROLE"
    };

    user = await usersService.addUser(user);
    if (user === null) {
        return error(res, "insert", 500);
    }

    // delete param password
    delete user.password;

    let token = app.get('jwt').sign({
        currentUser: user,
        time: Date.now() / 1000
    }, app.get('encrypt'));

    let json = {
        authenticated: true,
        user: user,
        token: token
    };
    res.status(200);
    res.json(json);
});

router.post("/api/login", async function (req, res) {
    if (req.body.email === null) {
        return error(res, "email");
    }
    if (req.body.password === null) {
        return error(res, "password");
    }

    let secPassword = app.get('crypto').createHmac('sha256', app.get('encrypt')).update(req.body.password).digest('hex');
    let user = {
        email: req.body.email,
        password: secPassword
    };

    let users = await usersService.findAllUsers(user);
    if (users === null || users.length === 0) {
        return error(res, "login");
    }

    user = users[0];
    let json = loginSuccesfully(user);
    res.status(200);
    res.json(json);
});

router.post("/api/user/list", async function (req, res) {
    let filter = req.body.filter || {};
    let pages = req.body.page;

    let users;
    if (pages) {
        users = await usersService.findAllUsersPage(filter, pages);
    } else {
        users = {
            array: await usersService.findAllUsers(filter),
            pages: 0
        };
    }

    if (!users.array) {
        return error(res, "find");
    }

    // delete param password
    users.array.forEach(u => delete u.password);

    res.status(200);
    return res.json(users);
});

/* DELETE users listing. */
router.delete("/api/user/delete/:id", async function (req, res) {
    let id = req.params.id;

    if (id === null) {
        return error(res, "user");
    }

    let user = {
        _id: id
    };

    user = await usersService.removeUser(user);
    if (user === null) {
        return error(res, "delete", 500);
    }

    res.status(200);
    res.json(user);
});

module.exports = router;

function loginSuccesfully(user) {
    delete user.password;

    let token = app.get('jwt').sign({
        currentUser: user,
        time: Date.now() / 1000
    }, app.get('encrypt'));

    return {
        authenticated: true,
        user: user,
        token: token
    };
}
