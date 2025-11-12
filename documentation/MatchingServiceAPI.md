| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| GET      | /health       | Checks the status of the API service | res.status(200).json({ status: "healthy", service: "matching-service" });
| POST      | /matching/match       | Adds a user into the matching queue | returns success message with details of userId, username, difficulties and topics chosen
| DELETE     | /matching/match/:userId       | Removes the user from the matching queue | Returns a success message indicating that the user has left the matching queue
| GET      | /matching/status/:userId    | Checks whether the user has found a match | Returns the matching status of the current user
| GET      | /matching/session/:sessionId       | Get the details of the session assigned to the user | Returns the details of the current session that the user is currently in
| DELETE      | /matching/session/:userId       | End the session when the user leaves the collab page | Returns a status and result indicating whether the user has been removed from the session