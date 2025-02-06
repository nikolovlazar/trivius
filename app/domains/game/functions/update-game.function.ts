import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Game } from '@/domains/game/entities/game';

import { authMiddleware } from '@/domains/shared/middleware/auth.middleware';

import { gameRepository } from '@/container';

export const updateGame = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      answer_window: z.number().optional(),
    })
  )
  .handler(
    async ({
      data: { id, title, description, answer_window },
      context: { user },
    }) => {
      let game: Game;
      try {
        game = await gameRepository.get(id);
      } catch (error) {
        throw new Error('Game does not exist');
      }

      const gameMastersIds = await gameRepository.getGameMastersIds(game.id);

      const gameBelongsToUser = gameMastersIds.includes(user.id);

      if (!gameBelongsToUser) {
        throw new Error('Game does not belong to user');
      }

      try {
        const updatedGame = await gameRepository.update({
          id,
          title,
          description,
          answer_window,
        });

        return updatedGame;
      } catch (error) {
        throw new Error('Failed to update game');
      }
    }
  );
