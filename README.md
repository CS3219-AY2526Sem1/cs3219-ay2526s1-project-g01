[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/QUdQy4ix)

# CS3219 Project (PeerPrep) - AY2526S1

## Group: G01

### Note:

- You are required to develop individual microservices within separate folders within this repository.
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements.

### Set-up

#### Initial

1. Run `npm run install:all` to install all needed node-modules in various service/frontend
2. Set-up the respective .env file in various service and at root by referring to the sample file

#### Local DB

1. Change the .env file at user-service to `ENV=local`
2. Run `npm run localdb` to start up the local mongoDB and mongo-express
3. Run `npm run stop:docker` to stop the local mongoDB and mongo-express. This will also stop any other running docker containers.
4. You can access the mongo-express dashboard at `localhost:8081` to view the database

#### Cloud DB

1. Change the .env file at user-service to `ENV=PROD`
2. Ensure that you have set the correct `MONGODB_URI` in the .env file at user-service

#### Running the project (development)

1. Run `npm run dev` to start up the user-service and frontend concurrently
2. ALternatively, you can run `cd user-service && npm run dev` and `cd frontend && npm run dev` in separate terminal windows to start up the user-service and frontend respectively
3. The frontend will be running at `localhost:3000` and user-service will be running at `localhost:5000`

#### Testing Docker production build

1. Run `docker-compose up --build` to build and start up the user-service and frontend in docker containers
2. For local DB, ensure that you have changed the .env file at user-service to `ENV=local` before running the command and run `docker-compose --profile localdb up --build` instead
3. TO run the containers run `docker-compose up` if using cloud DB or `docker-compose --profile localdb up` if using local DB
4. The frontend will be running at `localhost`
5. To stop the containers run `docker-compose down` or `docker-compose --profile localdb down` if using local DB. You can also run `npm run stop:docker` to stop the containers. This will also stop any other running docker containers.

### References:

- https://github.com/CS3219-AY2526Sem1/PeerPrep-UserService
