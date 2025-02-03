import { createServerFn } from '@tanstack/start';

import { Session } from '@/domains/session/entities/session';

import { Game } from '@/domains/game/entities/game';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const getGames = createServerFn()
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const supabase = getSupabaseServerClient();

    const { data: gamesGms, error: gamesGmsError } = await supabase
      .from('games_gms')
      .select('*')
      .eq('gm_id', userId);

    if (gamesGmsError) {
      throw new Error('Failed to fetch games');
    }

    const games = await Promise.all(
      gamesGms.map(async (gameGm) => {
        const gamePromise = supabase
          .from('games')
          .select('*')
          .eq('id', gameGm.game_id)
          .single();

        const sessionsPromise = supabase
          .from('sessions')
          .select('*')
          .eq('game_id', gameGm.game_id);

        const [{ data: game }, { data: sessions }] = await Promise.all([
          gamePromise,
          sessionsPromise,
        ]);

        return { game: game as Game, sessions: (sessions as Session[]) ?? [] };
      })
    );

    return games;
  });
