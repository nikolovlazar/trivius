import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { Session } from '@/domains/session/entities/session';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { gameRepository, sessionRepository } from '@/container';

export const deleteSession = createServerFn()
  .validator(
    z.object({
      session_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await fetchUser();

    if (!user) {
      throw new Error('Must be logged in to delete sessions.');
    }

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
