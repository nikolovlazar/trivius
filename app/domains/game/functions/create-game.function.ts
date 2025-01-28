import { z } from 'vinxi';
import { createServerFn } from '@tanstack/start';

import { Game } from '@/domains/game/entities/game';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const createGame = createServerFn()
  .validator(
    z.object({
      title: z.string().min(1),
      description: z.string().optional().nullable(),
      userId: z.string(),
    })
  )
  .handler(async ({ data: { userId, title, description } }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('games')
      .insert({
        title,
        description,
      })
      .select()
      .single<Game>();

    if (error) {
      throw new Error('Failed to create game');
    }

    const { error: gameGmsError } = await supabase
      .from('games_gms')
      .insert({ game_id: data.id, gm_id: userId });

    if (gameGmsError) {
      throw new Error('Failed to assign game to user');
    }

    return data;
  });
