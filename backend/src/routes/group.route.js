const router = require("express").Router();
const { createGroup, getGroups } = require("../controllers/group.js");
const { verifyAuth } = require("../middleware/auth.js");

router.route("/")
    .get(verifyAuth, getGroups)
    .post(verifyAuth, createGroup);

module.exports = router;