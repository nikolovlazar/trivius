import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository } from '@/container';

export const createGame = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      title: z.string().min(1),
      description: z.string().optional().nullable(),
    })
  )
  .handler(async ({ data: { title, description }, context: { user } }) => {
    try {
      const created = await gameRepository.create({
        game: { title, description },
        userId: user.id,
      });

      return created;
    } catch (e) {
      throw new Error('Cannot create game. Please try again...');
    }
  });
