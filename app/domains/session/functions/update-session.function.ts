import { createServerFn } from '@tanstack/start';
import { z } from 'vinxi';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const updateSession = createServerFn()
  .validator(
    z.object({
      id: z.number(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      open: z.boolean().default(false),
      label: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { user } = await fetchUser();

    if (!user) {
      throw new Error('Must be logged in to update session.');
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', data.id)
      .single();

    if (!session || sessionError) {
      throw new Error('Session not found.');
    }

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', session.game_id)
      .single();

    const { data: gameGms, error: gameGmsError } = await supabase
      .from('games_gms')
      .select('*')
      .eq('game_id', session.game_id)
      .eq('gm_id', user.id)
      .single();

    if (!game || !gameGms || gameError || gameGmsError) {
      throw new Error('Game does not exist, or is not assigned to user');
    }

    const updatingData = { ...session };

    if (data.open) {
      updatingData.open = data.open;
    }

    if (data.start_time && data.start_time.length > 0) {
      updatingData.start_time = data.start_time;
    }

    if (data.end_time && data.end_time.length > 0) {
      updatingData.end_time = data.end_time;
    }

    if (data.label) {
      updatingData.label = data.label;
    }

    const { error } = await supabase
      .from('sessions')
      .update({
        open: updatingData.open,
        start_time: updatingData.start_time,
        end_time: updatingData.end_time,
        label: updatingData.label,
      })
      .eq('id', session.id);

    if (error) {
      console.error(error.message);
      throw new Error('Failed to update session');
    }

    return session;
  });
