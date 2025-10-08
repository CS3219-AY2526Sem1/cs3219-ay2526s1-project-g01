import http from "http";
import index from "./index.js";
import "dotenv/config";
import { connectToDB } from "./model/repository.js";

const port = process.env.SERVICE_PORT || 8080;
const host = "0.0.0.0"; 

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port, host);
  console.log("User service server listening on port:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

