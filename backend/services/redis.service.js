import Redis from "ioredis";

const redisClient  = Redis.createClient({
    host:'redis-15390.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
    port:15390,
    password:"k3r21fw2NVKZSbp1S502o2gt0Gb9P4ZI"
})

redisClient.on("connect",()=>{
    console.log("Redis connected")
})

redisClient.on("error", (err) => {
    console.error("Redis error event:", err);
  });

export default redisClient;