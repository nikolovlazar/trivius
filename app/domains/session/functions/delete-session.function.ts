import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Session } from '@/domains/session/types/session';
import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository, sessionRepository } from '@/container';

export const deleteSession = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      session_id: z.number(),
    })
  )
  .handler(async ({ data, context: { user } }) => {
    let session: Session;
    try {
      session = await sessionRepository.get(data.session_id);
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
      const deleted = await sessionRepository.delete(session.id);
      return deleted;
    } catch (error) {
      throw new Error('Failed to delete session');
    }
  });
