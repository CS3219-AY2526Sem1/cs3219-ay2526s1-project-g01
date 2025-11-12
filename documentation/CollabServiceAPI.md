| Method | Endpoint                 | Description                 | Return             |
| ------ | ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------- |
| POST   | /api/sessions            | Creates a new session for both users to join in the Collab Page | Returns a JSON object containing a message and the question information                     |
| GET    | /api/sessions            | Checks the status of the API endpoint                           | Returns a JSON object containing a message                                                  |
| GET    | /api/sessions/:sessionId | Get details of the specified Session                            | Returns a JSON object containing sessionId, a message and the associated question data      |
| GET    | /api/:userId             | Checks if the user has an active session                        | Returns a JSON object containing a hasSession boolean field, partnerId and sessionId fields |
| DELETE | /api/:userId             | Removes the user's current session                              | Returns a JSON object with deletion status                                                  |
