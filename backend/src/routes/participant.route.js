const router = require("express").Router();
const { getParticipants, addParticipant, removeParticipant } = require("../controllers/participant.js");
const { verifyAuth } = require("../middleware/auth.js");

router.route("/")
    .delete(verifyAuth, removeParticipant)
    .post(verifyAuth, addParticipant);
router.route("/:groupId")
    .get(verifyAuth, getParticipants);

module.exports = router;