const cors = require('cors');
const express = require('express');
const { redisPub, redisSubGroup, redisSubMessage } = require("./config/redis.js")();

const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
    socket.on("new-group", (data) => {
        redisPub.publish("NEW-GROUP", JSON.stringify(data));
    });
    socket.on("new-message", (data) => {
        redisPub.publish("NEW-MESSAGE", JSON.stringify(data));
    });
});
redisSubMessage.on("message", (channel, message) => {
    let data = JSON.parse(message);
    let newData = {
        messageId: data.messageId,
        groupId: data.groupId,
        message: data.message,
        messageType: data.messageType,
        replyTo: data.replyTo,
        createdAt: data.createdAt,
        user: {
            userId: data.user.userId,
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            providerId: data.user.providerId
        }
    }
    data.participants.forEach((item) => {
        if (item.userId === data.user.userId) return;
        io.emit(`${item.userId}-new-message`, newData);
    });
});

redisSubGroup.on("message", (channel, message) => {
    let data = JSON.parse(message);
    data.participants.forEach((item) => {
        if (item.userId === data.owner._id) return;
        io.emit(`${item.userId}-new-group`, data);
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.use("/api/user", require('./src/routes/user.route.js'));
app.use("/api/group", require('./src/routes/group.route.js'));
app.use("/api/participant", require('./src/routes/participant.route.js'));
app.use("/api/message", require('./src/routes/message.route.js'));

module.exports = server;