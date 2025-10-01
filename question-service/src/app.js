import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// simple route
app.get('/question', (req, res) => {
  res.json({
    ok: true,
    message: 'Question service responding',
    data: { questionId: 1, text: 'What is your name?' }
  });
});

export default app; // <-- ES module export
