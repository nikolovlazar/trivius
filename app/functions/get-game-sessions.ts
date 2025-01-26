import { getSupabaseServerClient } from '@/utils/supabase/server';
import { createServerFn } from '@tanstack/start';

export const getGameSessions = createServerFn()
  .validator((data: number) => data)
  .handler(async (ctx) => {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('game_id', ctx.data);

    if (error) {
      throw new Error('Failed to fetch game sessions');
    }

    return data;
  });
