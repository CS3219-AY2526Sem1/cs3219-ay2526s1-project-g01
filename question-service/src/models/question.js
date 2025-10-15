import pool from '../db.js'


export async function getAllQuestionsFromDb() {
  const result = await pool.query('SELECT * FROM questions');
  return result.rows;
}

// export async function getQuestionById(id) {
//   const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
//   return result.rows[0]; // Return single question or undefined
// }

// export async function createQuestion(questionData) {
//   const { title, content, user_id } = questionData;
//   const result = await pool.query(
//     'INSERT INTO questions (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
//     [title, content, user_id]
//   );
//   return result.rows[0];
// }