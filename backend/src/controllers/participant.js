const { default: mongoose } = require('mongoose');
const Participant = require('../models/participants.model.js');

exports.addParticipant = async (req, res) => {
    try {
        let { groupId, participants = [] } = req.body;

        let data = await Participant.findOne({ groupId, userId: req.user._id });

        if (!data || !data.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Participant.insertMany(participants.map((item) => {
            return {
                userId: item._id,
                groupId: data.groupId
            }
        }));

        res.status(201).json({ message: "Participants added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.removeParticipant = async (req, res) => {
    try {
        let { groupId, userId } = req.body;

        let data = await Participant.findOne({ groupId, userId: req.user._id });

        if(!userId || (req.user._id !== userId)) {
            if (!data || !data.isAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        }

        if((req.user._id === userId) && data.isOwner) {
            return res.status(401).json({ message: "You can't remove yourself from the group" });
        }

        await Participant.deleteOne({ groupId, userId: (userId || req.user._id) });

        res.status(201).json({ message: "Participants added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getParticipants = async (req, res) => {
    try {
        let { groupId } = req.params;

        let data = await Participant.aggregate([
            {
                $match: {
                    groupId: new mongoose.Types.ObjectId(groupId),
                    userId: req.user._id
                }
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
                    userId: "$user._id",
                    firstname: "$user.firstname",
                    lastname: "$user.lastname",
                    providerId: "$user.providerId",
                    isAdmin: 1,
                    isOwner: 1
                }
            }
        ]);

        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}