const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        default: "text"
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("messages", messageSchema);