import pool from '../db.js'


export async function getAllQuestionsFromDb() {
  const result = await pool.query(`
    SELECT 
      q.title,
      q.topic,
      q.difficulty,
      q.description,
      q.constraints,
      tc1.input AS test_case_1_input,
      tc1.output AS test_case_1_output,
      tc2.input AS test_case_2_input,
      tc2.output AS test_case_2_output
    FROM questions q
    INNER JOIN test_cases tc1 ON q.title = tc1.title AND tc1.index = 1
    INNER JOIN test_cases tc2 ON q.title = tc2.title AND tc2.index = 2;    
  `);
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