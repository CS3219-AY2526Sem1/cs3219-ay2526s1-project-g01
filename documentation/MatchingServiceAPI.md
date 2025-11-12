| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| GET      | /health       | Checks the status of the API service | res.status(200).json({ status: "healthy", service: "matching-service" });
| POST      | /matching/match       | Adds a user into the matching queue |
| DELETE     | /matching/match/:userId       | Removes the user from the matching queue |
| GET      | /matching/status/:userId    | Checks whether the user has found a match |
| GET      | /matching/session/:sessionId       | Get the details of the session assigned to the user |
| DELETE      | /matching/session/:userId       | End the session when the user leaves the collab page |