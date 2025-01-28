import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { getSupabaseServerClient } from '@/shared/utils/supabase/server';

export const createSession = createServerFn()
  .validator(
    z.object({
      game_id: z.number(),
      start_time: z.string(),
      open: z.boolean().default(true),
      user_id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', data.game_id)
      .single();

    const { data: gameGms, error: gameGmsError } = await supabase
      .from('games_gms')
      .select('*')
      .eq('game_id', data.game_id)
      .eq('gm_id', data.user_id)
      .single();

    if (!game || !gameGms || gameError || gameGmsError) {
      throw new Error('Game does not exist, or is not assigned to user');
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        game_id: data.game_id,
        start_time: data.start_time,
        open: data.open,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create session');
    }

    return session;
  });
