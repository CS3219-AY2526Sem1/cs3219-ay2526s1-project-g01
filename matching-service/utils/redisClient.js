require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_HOST || "redis://redis-matching-service:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("[REDIS] Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`[REDIS] Reconnecting in ${delay}ms... (attempt ${retries})`);
      return delay;
    },
    connectTimeout: 10000,
  },
});

client.on("error", (err) => console.error("[REDIS ERROR]", err));
client.on("ready", () => console.log("[REDIS] Connected and ready"));
client.on("end", () => console.log("[REDIS] Connection closed"));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("[REDIS] Failed to connect:", err);
    process.exit(1);
  }
})();

const shutdown = async () => {
  console.log("[REDIS] Closing connection...");
  await client.quit();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = client;
