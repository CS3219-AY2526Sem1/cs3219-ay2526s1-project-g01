import pool from '../db.js'

export async function getAllQuestionsFromDb({ topic, difficulty, limit }) {
  let query = `
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
      INNER JOIN test_cases tc2 ON q.title = tc2.title AND tc2.index = 2    
    `;

  const conditions = [];
  const values = [];

  if (topic) {
    values.push(topic);
    conditions.push(`q.topic = $${values.length}`);
  }

  if (difficulty) {
    values.push(difficulty);
    conditions.push(`q.difficulty = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // query += ' ORDER BY q.title;';

  if (limit) {
    values.push(limit);
    query += ` LIMIT $${values.length}`;
  }

  // Default limit to 20 if not specified
  const DEFAULT_LIMIT = 20;
  if (!limit) {
    values.push(DEFAULT_LIMIT);
    query += ` LIMIT $${values.length}`;
  }

  query += ';';

  const result = await pool.query(query, values);
  return result.rows;
}

