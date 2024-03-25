const mongoose = require("mongoose");

const seenSchema = new mongoose.Schema({
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
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("seens", seenSchema);