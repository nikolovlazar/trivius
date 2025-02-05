import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/start';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { user } = await fetchUser();

  if (!user) {
    throw new Error('Must be logged in to create a game.');
  }

  return next({ context: { user } });
});
