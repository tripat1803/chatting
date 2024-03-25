const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    return jwt.sign({
        _id: user._id,
        providerId: user.providerId
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
}