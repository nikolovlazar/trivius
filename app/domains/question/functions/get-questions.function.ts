import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { questionRepository } from '@/container';

export const getQuestions = createServerFn()
  .validator(z.object({ game_id: z.number() }))
  .handler(async ({ data }) => {
    const questions = await questionRepository.getByGameId(data.game_id);

    return questions;
  });
