| Method     | Endpoint | Description | Return |
| ----------- | ----------- | ----------- | ----------- |
| POST      | /questions/attempts       | Create new attempt record(s) | Returns success message and JSON entries of the rows inserted into attempts table |
| GET   | /questions/attempts/{user_id}  | Get all attempts for a user | Returns a JSON body with total_count and an array of question_ids of attempted questions sorted in ascending order |
| GET   | /questions/attempts/{user_id}/recent      | Get recent attempts for a user | Returns a JSON array of recent attempts with question details (question_id, attempted_date, question_title, topics). Query param: limit (default: 3, max: 50) |
| GET   | /questions/attempts/{user_id}/count       | Get total count of attempted questions |  Returns a JSON object with total_count field |
| GET   | /questions/attempts/{user_id}/week        | Get attempts in the past 7 days | Returns a JSON object with count and questions array (question_id, attempted_date) |
| GET   | /questions/attempts/{user_id}/topics       | Get topic statistics for a user| Returns a JSON array of tuples (topic, attempted_topic_count) |
| GET   | /questions/attempts/{user_id}/favourite-topic       | Get favourite topic(s) for a user | Returns a JSON array of favourite topic(s) with the highest attempt count |