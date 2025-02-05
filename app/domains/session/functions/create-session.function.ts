import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository, sessionRepository } from '@/container';

export const createSession = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      game_id: z.number(),
      start_time: z.string(),
      open: z.boolean().default(true),
      label: z.string().optional(),
    })
  )
  .handler(async ({ data, context: { user } }) => {
    const gameBelongsToUser = await gameRepository.belongsTo(
      data.game_id,
      user.id
    );

    if (!gameBelongsToUser) {
      throw new Error('Game does not belong to user');
    }

    try {
      const session = await sessionRepository.create(data);
      return session;
    } catch (error) {
      throw new Error('Failed to create session');
    }
  });
