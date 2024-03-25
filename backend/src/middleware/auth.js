const jwt = require("jsonwebtoken");

exports.verifyAuth = async (req, res, next) => {
    try {
        let token = req.headers["x-auth-token"];
        if(!token){
            return res.sendStatus(404);
        }
        let decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch(err) {
        return res.status(403).json({
            invalidToken: true,
            message: "Error occured"
        })
    }
}