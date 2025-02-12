import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository, questionRepository } from '@/container';

export const createQuestion = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      content: z.string(),
      game_id: z.number(),
      right_answer_index: z.number(),
      answer_1_content: z.string(),
      answer_2_content: z.string(),
      answer_3_content: z.string(),
      answer_4_content: z.string(),
    })
  )
  .handler(async ({ data, context }) => {
    const { user } = context;

    const gameMasters = await gameRepository.getGameMastersIds(data.game_id);

    if (!gameMasters.includes(user.id)) {
      throw new Error('You are not a game master');
    }

    const {
      content,
      game_id,
      right_answer_index,
      answer_1_content,
      answer_2_content,
      answer_3_content,
      answer_4_content,
    } = data;

    const createdQuestion = await questionRepository.create({
      content,
      game_id,
      right_answer_index,
      answer_1_content,
      answer_2_content,
      answer_3_content,
      answer_4_content,
    });

    return createdQuestion;
  });
