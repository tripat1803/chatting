const mongoose = require('mongoose');
const Group = require('../models/groups.model.js');
const Participant = require('../models/participants.model.js');
const User = require('../models/users.model.js');

exports.createGroup = async (req, res) => {
    try {
        const { name, description, participants = [] } = req.body;
        const owner = req.user._id;
        let user = await User.findOne({ _id: owner });

        let data = await (new Group({
            name,
            description,
            owner
        })).save();

        await Participant.insertMany([...participants.map((item) => {
            return {
                userId: item._id,
                groupId: data._id
            }
        }), { userId: owner, groupId: data._id, isAdmin: true, isOwner: true }]);

        await Group.updateOne({ _id: data._id }, { $set: { participants: participants.length + 1 } });

        let group = {
            groupId: data._id,
            name: data.name,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            owner: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                providerId: user.providerId,
                owned: true
            },
            participants: participants.map((item) => {
                return {
                    userId: item.userId,
                }
            }),
            lastMessage: []
        }

        res.status(201).json({ message: "Group created successfully", group });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
    }
}

exports.getGroups = async (req, res) => {
    try {
        let type = req.query.type;
        let search = (type && (type === "owned")) ? {
            userId: new mongoose.Types.ObjectId(req.user._id),
            isAdmin: true,
            isOwner: true
        } : {
            userId: new mongoose.Types.ObjectId(req.user._id)
        };
        let groups = await Participant.aggregate([
            {
                $match: search
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupId",
                    foreignField: "_id",
                    as: "group"
                }
            },
            {
                $unwind: "$group"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "group.owner",
                    foreignField: "_id",
                    let: {
                        "owner_id": "$group.owner",
                    },
                    pipeline: [
                        {
                            $project: {
                                "_id": 1,
                                "firstname": 1,
                                "lastname": 1,
                                "providerId": 1,
                                "owned": {
                                    $cond: {
                                        if: {
                                            $eq: [new mongoose.Types.ObjectId(req.user._id), "$$owner_id"]
                                        },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        }
                    ],
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $lookup: {
                    from: "participants",
                    localField: "group._id",
                    foreignField: "groupId",
                    pipeline: [
                        {
                            $project: {
                                "_id": 0,
                                "userId": "$userId"
                            }
                        }
                    ],
                    as: "participants"
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "groupId",
                    foreignField: "groupId",
                    pipeline: [
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: "lastMessage"
                }
            },
            {
                $project: {
                    "groupId": "$group._id",
                    "name": "$group.name",
                    "description": "$group.description",
                    "createdAt": "$group.createdAt",
                    "owner": "$owner",
                    "participants": "$participants",
                    "lastMessage": "$lastMessage"
                }
            }
        ]);

        return res.status(200).json({ groups });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateGroup = async (req, res) => {
    try {
        let { groupId, name, description } = req.body;

        await Group.updateOne({ _id: groupId }, { $set: { name, description } });

        res.status(200).json({ message: "Group updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}