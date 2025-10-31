// import { createClient } from "redis";
// import "dotenv/config";

// const REDIS_HOST = process.env.REDIS_HOST;
// const REDIS_DB = process.env.REDIS_DB;
// const REDIS_PORT = process.env.REDIS_PORT;
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// const dbClient = createClient({
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//   },
//   password: REDIS_PASSWORD,
//   database: REDIS_DB,
// });

// dbClient.on("error", (err) => console.log("Redis Client Error", err));

// async function startDB() {
//   if (!dbClient.isOpen) {
//     await dbClient.connect();
//     console.log("Redis db connected");
//   }
// }

// async function endDB() {
//   if (dbClient.isOpen) {
//     await dbClient.quit();
//     console.log("Redis db disconnected");
//   }
// }

// export { dbClient, startDB, endDB };
