require("dotenv").config();
const Redis = require("ioredis");

const connectToRedis = () => {
    try {
        let config = {
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
        const redisPub = new Redis(config);
        const redisSubGroup = new Redis(config);
        const redisSubMessage = new Redis(config);
    
        redisSubGroup.subscribe("NEW-GROUP");
        redisSubMessage.subscribe("NEW-MESSAGE");

        console.log("Conncted to Redis");
    
        return { redisPub, redisSubGroup, redisSubMessage };
    } catch (err){
        console.log(err);
    }
}

module.exports = connectToRedis;