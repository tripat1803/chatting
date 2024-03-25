const router = require("express").Router();
const { getMessages, createMessage, editMessage, deleteMessage } = require("../controllers/message.js");
const { verifyAuth } = require("../middleware/auth.js");

router.route("/")
    .post(verifyAuth, createMessage)
    .put(verifyAuth, editMessage)
    .delete(verifyAuth, deleteMessage);

router.route("/:groupId")
    .get(verifyAuth, getMessages);

module.exports = router;