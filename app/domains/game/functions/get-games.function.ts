import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository } from '@/container';

export const getGames = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { user } }) => {
    try {
      const games = await gameRepository.getUsersGamesWithSessions(user.id);
      return games;
    } catch (e) {
      throw new Error('Cannot get games...');
    }
  });
