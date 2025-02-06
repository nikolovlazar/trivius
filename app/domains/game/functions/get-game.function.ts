import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Session } from '@/domains/session/types/session';

import { Game } from '@/domains/game/types/game';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { gameRepository, sessionRepository } from '@/container';

export const getGame = createServerFn()
  .validator(z.number())
  .handler(async ({ data }) => {
    let game: Game;
    try {
      game = await gameRepository.get(data);
    } catch (error) {
      throw new Error('Game not found');
    }

    const result: { game: Game; sessions: Session[] } = { game, sessions: [] };

    const { user } = await fetchUser();

    if (user) {
      try {
        const sessions = await sessionRepository.getForGame(game.id);
        result.sessions = sessions;
      } catch (e) {}
    }

    return result;
  });
