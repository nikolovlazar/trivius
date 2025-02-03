import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { gameRepository } from '@/container';

export const createGame = createServerFn()
  .validator(
    z.object({
      title: z.string().min(1),
      description: z.string().optional().nullable(),
    })
  )
  .handler(async ({ data: { title, description } }) => {
    const { user } = await fetchUser();

    if (!user) {
      throw new Error('Must be logged in to create a game.');
    }

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
