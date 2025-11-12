| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| GET   | /auth/login      | Logs in a user with email and password credentials | 
| GET   | /auth/verify-token     | Verifies if the provided JWT token is valid and returns user data | 
| GET   | /auth/password/request-reset      | Initiates password reset process by sending reset email to user | 
| GET   | /auth/password/validate-token     | Validates password reset token without changing password | 
| GET   | /auth/password/confirm-rest      | Confirms password reset using token and sets new password | 
| POST   | /users     | Add a new user | 
| GET   | /users/:id   | Get details of a user | 
| PATCH   | /users/:id   | Modify an existing user | 
| PATCH   | /users/:id/password     | Change the password of the specified user | 
| PATCH   | /users/:id/username   | Change the username of the specified user | 
| DELETE   | /users/:id   | Remove the user from the database | 
| GET   | /verification/verify   | Verify a user's email | 
| GET   | /verification/resend   | Resend the verification code for the user | 
| GET   | /verification/request-email-change-code    | Get the code for the email change | 
| GET   | /verification/verify-email-change-code  | Verify the code for the email change | 