const jwt = require("jsonwebtoken");
const auth_controller = require("../controllers/auth.controller");
const user_controller = require("../controllers/user.controller");
const waitlist_controller = require("../controllers/waitlist.controller");

const appRoute = (database, config) => {
    const router = require("express").Router();

    const authToken = (req, res, next) => {
        var token = req.headers['authorization'];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, config.TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            res.user = user;
            next();
        })
    }

    router.get("/home/", (req, res) => {
        return res.status(200).send({message: "Hello World"});
    })

    // Auth Route
    router.post("/auth/", auth_controller.auth);
    router.post("/auth/register/", auth_controller.register_user);
    router.post("/auth/verify_email/", auth_controller.verify_email);

    // User Route
    router.get("/user/", authToken, user_controller.current_user);
    router.get("/user/:username/", user_controller.get_user);
    router.post("/user/edit/", authToken, user_controller.edit_profile);
    router.post("/user/:username/message/new/", user_controller.new_message);
    router.delete("/user/:username/message/delete/:message_id/", user_controller.delete_message);

    // Waitlist Route
    router.post("/waitlist/join/", waitlist_controller.join_waitlist);

    return router;
}

module.exports = appRoute;
