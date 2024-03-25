const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    imageId: {
        type: String,
        default: ""
    },
    isConversation: {
        type: Boolean,
        default: false
    },
    participants: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('groups', groupSchema);