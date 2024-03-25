const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    // Used when isConversation is false
    isAdmin: {
        type: Boolean
    },
    isOwner: {
        type: Boolean
    }
}, {
    timestamps: true,
    autoIndex: false
});

participantSchema.index({ userId: 1, groupId: 1 }, { unique: true });

module.exports = mongoose.model('participants', participantSchema);