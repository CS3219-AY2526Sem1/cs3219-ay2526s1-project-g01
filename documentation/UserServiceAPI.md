| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| POST   | /auth/login      | Logs in a user with email and password credentials | Returns JWT access token and user data |
| GET   | /auth/verify-token     | Verifies if the provided JWT token is valid and returns user data | Returns authenticated user's data |
| POST   | /auth/password/request-reset      | Initiates password reset process by sending reset email to user | Returns success message confirming email sent |
| GET   | /auth/password/validate-token     | Validates password reset token without changing password | Returns success message if token is valid |
| POST   | /auth/password/confirm-reset      | Confirms password reset using token and sets new password | Returns success message confirming password reset |
| POST   | /users     | Add a new user (registration) | Returns created user data and verification email confirmation |
| GET   | /users/:id   | Get details of a specific user | Returns user data |
| PATCH   | /users/:id   | Modify an existing user's information | Returns updated user data |
| PATCH   | /users/:id/password     | Change the password of the specified user | Returns success message confirming password update |
| PATCH   | /users/:id/username   | Change the username of the specified user | Returns updated user data |
| DELETE   | /users/:id   | Remove the user from the database | Returns success message confirming user deletion |
| GET   | /verification/verify   | Verify a user's email using verification token | Returns success message or redirect URL |
| POST   | /verification/resend   | Resend the verification email to the user | Returns success message confirming verification email resent |
| POST   | /verification/request-email-change-code    | Request 6-digit verification code for email change | Returns success message confirming code sent |
| POST   | /verification/verify-email-change-code  | Verify the 6-digit code for email change | Returns success message if code is valid |
| POST   | /verification/change-email  | Complete email change process after code verification | Returns success message confirming verification email sent to new address | 
