import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Game } from '@/domains/game/entities/game';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { gameRepository } from '@/container';

export const deleteGame = createServerFn()
  .validator(z.number())
  .handler(async ({ data }) => {
    const { user } = await fetchUser();

    if (!user) {
      throw new Error('User not found');
    }

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
