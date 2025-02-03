import { createServerFn } from '@tanstack/start';

import { Session } from '@/domains/session/entities/session';

import { Game } from '@/domains/game/entities/game';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const getGame = createServerFn()
  .validator(({ gameId, userId }: { gameId: number; userId: string }) => ({
    gameId,
    userId,
  }))
  .handler(async ({ data: { gameId, userId } }) => {
    const supabase = getSupabaseServerClient();

    const { data: gameGm, error: gameGmError } = await supabase
      .from('games_gms')
      .select('*')
      .eq('gm_id', userId)
      .eq('game_id', gameId)
      .single();

    if (gameGmError) {
      throw new Error('Failed to fetch game');
    }

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
  });
