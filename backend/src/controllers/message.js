const Participant = require('../models/participants.model.js');
const Message = require('../models/messages.model.js');
const { default: mongoose } = require('mongoose');

exports.createMessage = async (req, res) => {
    try {
        const { groupId, message, type, replyTo } = req.body;
        let check = await Participant.findOne({ userId: req.user._id, groupId: groupId }).populate("userId");

        if (!check) {
            return res.status(403).json({ message: "You are not a participant of this group" });
        }

        let data = await (new Message({
            userId: req.user._id,
            groupId: groupId,
            message: message,
            messageType: type,
            replyTo: replyTo
        })).save();

        return res.status(201).json({
            message: {
                messageId: data._id,
                groupId: data.groupId,
                message: data.message,
                messageType: data.messageType,
                replyTo: data.replyTo,
                createdAt: data.createdAt,
                user: {
                    userId: req.user._id,
                    firstname: check.userId.firstname,
                    lastname: check.userId.lastname,
                    providerId: check.userId.providerId
                }
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.editMessage = async (req, res) => {
    try {
        const { messageId, message, type } = req.body;

        await Message.updateOne({
            _id: messageId,
            userId: req.user._id
        }, {
            $set: {
                message: message,
                messageType: type
            }
        });

        return res.status(201).json({ data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;

        await Message.deleteOne({
            _id: messageId,
            userId: req.user._id
        });

        return res.status(201).json({ data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getMessages = async (req, res) => {
    try {
        let limit = req.query.limit || 14;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        const { groupId } = req.params;
        let check = await Participant.findOne({ userId: req.user._id, groupId: groupId });

        if (!check) {
            return res.status(403).json({ message: "You are not a participant of this group" });
        }

        let data = await Message.aggregate([
            {
                $match: {
                    groupId: new mongoose.Types.ObjectId(groupId)
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    messageId: "$_id",
                    groupId: 1,
                    message: 1,
                    messageType: 1,
                    replyTo: 1,
                    createdAt: 1,
                    user: {
                        userId: "$user._id",
                        firstname: 1,
                        lastname: 1,
                        providerId: 1
                    }
                }
            }
        ]);

        return res.status(200).json({ messages: data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}