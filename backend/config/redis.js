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
        const redisSub = new Redis(config);
    
        redisSub.subscribe("NEW-GROUP");
        redisSub.subscribe("NEW-MESSAGE");

        console.log("Conncted to Redis");
    
        return { redisPub, redisSub };
    } catch (err){
        console.log(err);
    }
}

module.exports = connectToRedis;