[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/QUdQy4ix)

# CS3219 Project (PeerPrep) - AY2526S1

## Group: G01

### Features

**PeerPrep** is a comprehensive peer programming platform designed to help users practice coding problems collaboratively in real-time.

#### Authentication & User Management
- User registration with email verification
- Secure login/logout with JWT authentication
- Password management (change, reset, forgot password)
- Email change with verification codes
- Profile settings and account deletion

#### Peer Matching System
- Smart matching based on difficulty (Easy, Medium, Hard) and topics
- Real-time matching with 5 minutes search timer
- Session persistence and rejoin capability

#### Collaborative Code Editor
- Real-time synchronized code editing using WebSocket and Yjs
- Multi-language support (JavaScript, Python, Java, C++, etc.)
- Monaco Editor with VS Code-like features
- Live cursor tracking and connection monitoring

#### Voice & Video Communication
- WebRTC-based peer-to-peer video chat
- Audio and video controls (mute/unmute)
- Reliable TURN/STUN server support
- Persistent connection throughout session

#### Chat & AI Assistant
- Real-time text messaging with collaboration partner
- AI code assistant with context-aware help
- Code explanation, debugging, and optimization suggestions
- Markdown-formatted responses with syntax highlighting

#### Dashboard & Statistics
- User statistics (total attempts, weekly attempts, favorite topics)
- Recent session history with question details
- Quick actions and personalized welcome page

#### Question Management
- Comprehensive question display (description, test cases, constraints)
- Question attempt tracking and history
- JWT-protected API with admin and user authorization

#### Microservices Architecture
- User Service, Matching Service, Collaboration Service, Question Service, AI Service, Communication Service
- API Gateway for centralized routing
- MongoDB, PosgreSQL and Redis databases
- Full Docker containerization with hot reload support on local development

### Set-up

#### Initial

1. Run `npm run install:all` to install all needed node-modules in various service/frontend
2. Set-up the respective .env file in various service and at root by referring to the sample files provided (.env.sample)

#### Local DB (User service)

1. Change the .env file at user-service to `ENV=local`
2. Run `npm run localdb` to start up the local mongoDB and mongo-express
3. Run `npm run stop:docker` to stop the local mongoDB and mongo-express. This will also stop any other running docker containers.
4. You can access the mongo-express dashboard at `localhost:8081` to view the database

#### Cloud DB (User service)

1. Change the .env file at user-service to `ENV=PROD`
2. Ensure that you have set the correct `MONGODB_URI` in the .env file at user-service

#### AI Service Setup

1. Set up the `.env` file in `ai-service` directory by referring to `.env.sample`
2. Configure the required API keys for your AI provider (e.g., OpenAI, Claude, etc.)

#### TURN/STUN Server Setup

1. For WebRTC video chat functionality, configure TURN/STUN server credentials in `frontend/.env.local`
2. Refer to the `.env.local.sample` file for required TURN server configuration variables

#### Running the project (development)

1. Run `npm run dev` to start up all microservices (user-service, matching-service, collab-service, question-service) in Docker with live reload, and the frontend on your host machine
2. The microservices run in Docker with hot reload enabled - any code changes will automatically restart the service
3. The frontend runs natively on your machine at `localhost:3000` for optimal Hot Module Replacement (HMR) performance
4. All microservices are exposed on their respective ports:
   - User Service: `localhost:4000`
   - Matching Service: `localhost:3002`
   - Collaboration Service: `localhost:8000`
   - Communication Service: `localhost:6000`
   - Question Service: `localhost:7000`
   - AI Service: `localhost:8086`
   - API Gateway: `localhost` (port 80)
5. Alternative: Run `npm run dev:frontend` to start only the frontend, or `npm run dev:docker` to start only the Docker services

#### Testing Docker production build

1. Run `docker-compose up --build` to build and start up the user-service and frontend in docker containers
2. For local DB, ensure that you have changed the .env file at user-service to `ENV=local` before running the command and run `docker-compose --profile localdb up --build` instead
3. TO run the containers run `docker-compose up` if using cloud DB or `docker-compose --profile localdb up` if using local DB
4. The frontend will be running at `localhost`
5. To stop the containers run `docker-compose down` or `docker-compose --profile localdb down` if using local DB. You can also run `npm run stop:docker` to stop the containers. This will also stop any other running docker containers.

### Deployment to GCP Guide
Refer to the deployment guide at [`Deployment.md`](./Deployment.md) for detailed instructions on deploying the application to Google Cloud Platform (GCP).

### References:

1. User service code: https://github.com/CS3219-AY2526Sem1/PeerPrep-UserService
2. Video SDK WebRTC guide: https://www.videosdk.live/developer-hub/webrtc/webrtc-project
3. Web RTC Full Course & More: https://youtu.be/QsH8FL0952k
4. WebRTC in 100 Seconds // Build a Video Chat app from Scratch
5. How to Dockerize an ExpressJS App: https://www.geeksforgeeks.org/linux-unix/how-to-dockerize-an-expressjs-app/
6. Node.js WebSockets: https://www.w3schools.com/nodejs/nodejs_websockets.asp
7. WebSocket Express Session Parse Example: https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
8. Winston and Morgan Logging Guide: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
9. Building a Shared Code Editor using Node.js, WebSocket and CRDT: https://dev.to/akormous/building-a-shared-code-editor-using-nodejs-websocket-and-crdt-4l0f
10. Fix "window is not defined" in Next.js: https://www.geeksforgeeks.org/reactjs/how-to-fix-the-error-window-is-not-defined-in-nextjs/
11. Prevent Multiple Tabs: https://stackoverflow.com/questions/11008177/stop-people-having-my-website-loaded-on-multiple-tabs
12. Decode Uint8Array into JSON: https://stackoverflow.com/questions/68453051/decode-a-uint8array-into-a-json

### AI Usage Documentation

For a comprehensive record of AI assistance utilized throughout this project, please refer to [`ai/usage-log.md`](./ai/usage-log.md). This document details all AI tools used, their specific purposes, and the extent of their contributions to the codebase.

