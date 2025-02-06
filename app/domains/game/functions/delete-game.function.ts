import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Game } from '@/domains/game/types/game';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository } from '@/container';

export const deleteGame = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data, context: { user } }) => {
    let game: Game;

    try {
      const usersGames = await gameRepository.getUsersGamesWithSessions(
        user.id
      );
      const target = usersGames.filter((ug) => ug.game.id === data);
      if (!target || target.length === 0) {
        throw new Error('Game does not belong to user');
      }
      game = target[0].game;
    } catch (e) {
      throw new Error('Game does not belong to user');
    }

    try {
      const deleted = await gameRepository.delete({
        gameId: game.id,
        userId: user.id,
      });
      return deleted;
    } catch (e) {
      throw new Error('Cannot delete game. Try again later.');
    }
  });
