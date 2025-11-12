| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| POST     | /api/sessions      | Creates a new session for both users to join in the Collab Page |
| GET      | /api/sessions        | Checks the status of the API endpoint | res.status(200).json({ message: "test1" });
| GET      | /api/sessions/:sessionId      | Get details of the specified Session |
| GET      | /api/:userId       | Get the current status of the user's Session |
| DELETE      | /api/:userId      | Removes the user's current session |