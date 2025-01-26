import { getSupabaseServerClient } from '@/utils/supabase/server';
import { createServerFn } from '@tanstack/start';
import { getGameSessions } from './get-game-sessions';

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
        const { data: game } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameGm.game_id)
          .single();

        const sessions = await getGameSessions({ data: game.id });
        return { game, sessions };
      })
    );

    return games;
  });
