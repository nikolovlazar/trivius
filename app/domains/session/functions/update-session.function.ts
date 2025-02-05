import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Session } from '@/domains/session/entities/session';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository, sessionRepository } from '@/container';

export const updateSession = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      open: z.boolean().default(false),
      label: z.string().optional(),
    })
  )
  .handler(async ({ data, context: { user } }) => {
    let session: Session;
    try {
      session = await sessionRepository.get(data.id);
    } catch (error) {
      throw new Error('Session does not exist');
    }

    const gameBelongsToUser = await gameRepository.belongsTo(
      session.game_id,
      user.id
    );

    if (!gameBelongsToUser) {
      throw new Error('Game does not belong to user');
    }

    try {
      const updated = await sessionRepository.update(data);
      return updated;
    } catch (error) {
      throw new Error('Failed to update session');
    }
  });
