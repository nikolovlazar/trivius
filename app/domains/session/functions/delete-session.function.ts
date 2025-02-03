import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';
import { fetchUser } from '@/domains/user/functions/fetch-user.function';

export const deleteSession = createServerFn()
  .validator(
    z.object({
      session_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { user } = await fetchUser();

    if (!user) {
      throw new Error('Must be logged in to create sessions.');
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', data.session_id)
      .single();

    if (sessionError) {
      throw new Error('Session not found!');
    }

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', session.game_id)
      .single();

    const { data: gameGms, error: gameGmsError } = await supabase
      .from('games_gms')
      .select('*')
      .eq('game_id', game?.id)
      .eq('gm_id', user.id)
      .single();

    if (!game || !gameGms || gameError || gameGmsError) {
      throw new Error('Game does not exist, or is not assigned to user');
    }

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', session.id);

    if (error) {
      throw new Error('Failed to delete session');
    }

    return session;
  });
