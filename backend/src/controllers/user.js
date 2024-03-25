const User = require('../models/users.model.js');
const { generateAccessToken } = require('../utils/utils');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
    try {
        let hash_password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        const data = await (new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            providerId: req.body.providerId,
            password: hash_password,
            providerType: "EMAIL",
        })).save();

        let token = generateAccessToken(data);

        return res.status(200).send({
            token,
            firstname: data.firstname,
            lastname: data.lastname,
            providerId: data.providerId,
            providerType: data.providerType,
            userId: data._id
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        let user = await User.findOne({ providerId: req.body.providerId });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid credentials');
        }
        let token = generateAccessToken(user);
        return res.status(200).send({
            token,
            firstname: user.firstname,
            lastname: user.lastname,
            providerId: user.providerId,
            providerType: user.providerType,
            userId: user._id
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        let data = await User.findOne({ _id: req.user._id });
        if (!data) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({
            firstname: data.firstname,
            lastname: data.lastname,
            providerId: data.providerId,
            userId: data._id
        });
    } catch (err){
        return res.status(500).json({
            message: "Server error"
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        let users = await User.find({
            _id: {
                $ne: req.user._id
            }
        }, {
            firstname: 1,
            lastname: 1,
            providerId: 1,
            "userId": "$_id"
        });
        return res.status(200).json({ users });
    } catch (err) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}