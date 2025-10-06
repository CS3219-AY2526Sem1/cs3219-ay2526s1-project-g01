import * as z from "zod";

const QuestionDifficulty = z.enum(["easy", "medium", "hard"]);

export const SessionModel = z.object({
  sessionId: z.string(),
  user1Id: z.string(),
  user2Id: z.string(),
  questionDifficulty: QuestionDifficulty,
  questionTopic: z.string(),
});
