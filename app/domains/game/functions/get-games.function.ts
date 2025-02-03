import { createServerFn } from '@tanstack/start';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { gameRepository } from '@/container';

export const getGames = createServerFn().handler(async () => {
  const { user } = await fetchUser();
  if (!user) {
    throw new Error('Must be logged in');
  }

  try {
    const games = await gameRepository.getUsersGamesWithSessions(user.id);
    return games;
  } catch (e) {
    throw new Error('Cannot get games...');
  }
});
