import * as z from "zod";

export const SessionModel = z.object({
  sessionId: z.string().uuid(),
  user1: z.object({
    userId: z.string(),
    username: z.string(),
  }),
  user2: z.object({
    userId: z.string(),
    username: z.string(),
  }),
  criteria: z.object({
    difficulty: z.array(z.string()),
    topics: z.array(z.string()),
  }),
});
