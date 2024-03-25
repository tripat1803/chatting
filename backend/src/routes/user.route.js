const router = require("express").Router();
const { loginUser, registerUser, getUser, getUsers } = require("../controllers/user.js");
const { verifyAuth } = require("../middleware/auth.js");

router.route("/")
        .post(loginUser)
        .get(verifyAuth, getUser);
router.route("/register").post(registerUser);
router.route("/all").get(verifyAuth, getUsers);

module.exports = router;