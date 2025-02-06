import { SupabaseClient } from '@supabase/supabase-js';

import type { Session } from '@/domains/session/entities/session';

import type {
  Game,
  GameInsert,
  GameUpdate,
} from '@/domains/game/entities/game';
import { IGameRepository } from '@/domains/game/repositories/game.repository.interface';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export class GameRepository implements IGameRepository {
  private _db: SupabaseClient;

  constructor() {
    this._db = getSupabaseServerClient();
  }

  async getGameMastersIds(gameId: Game['id']): Promise<string[]> {
    const { data, error } = await this._db
      .from('games_gms')
      .select('gm_id')
      .eq('game_id', gameId);

    if (error) {
      throw new Error('Cannot get game masters');
    }

    return data.map((gm) => gm.gm_id);
  }

  async get(id: Game['id']): Promise<Game> {
    const { data, error } = await this._db
      .from('games')
      .select('*')
      .eq('id', id)
      .single<Game>();

    if (!data || error) {
      throw new Error('Game does not exist');
    }

    return data;
  }

  async getUsersGamesWithSessions(
    userId: string
  ): Promise<{ game: Game; sessions: Session[] }[]> {
    const { data: gamesGms, error: userGamesError } = await this._db
      .from('games_gms')
      .select('*')
      .eq('gm_id', userId);

    if (!gamesGms || userGamesError) {
      throw new Error("Cannot get user's games", { cause: userGamesError });
    }

    const games = await Promise.all(
      gamesGms.map(async (gameGm) => {
        const gamePromise = this._db
          .from('games')
          .select('*')
          .eq('id', gameGm.game_id)
          .single();

        const sessionsPromise = this._db
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
  }

  async update(data: GameUpdate): Promise<Game> {
    const { data: updated, error } = await this._db
      .from('games')
      .update({
        title: data.title,
        description: data.description,
        answer_window: data.answer_window,
      })
      .eq('id', data.id)
      .select()
      .single<Game>();

    if (!updated || error) {
      throw new Error('Cannot update game', { cause: error });
    }

    return updated;
  }

  async create(data: { game: GameInsert; userId: string }): Promise<Game> {
    const { data: created, error } = await this._db
      .from('games')
      .insert(data.game)
      .select()
      .single<Game>();

    if (!created || error) {
      throw new Error('Cannot create game', { cause: error });
    }

    const { error: gameGmsError } = await this._db
      .from('games_gms')
      .insert({ game_id: created.id, gm_id: data.userId });

    if (gameGmsError) {
      throw new Error('Failed to assign game to user');
    }

    return created;
  }

  async delete({
    gameId,
    userId,
  }: {
    gameId: Game['id'];
    userId: string;
  }): Promise<Game> {
    const gamePromise = this._db
      .from('games')
      .delete()
      .eq('id', gameId)
      .single<Game>();

    const gameGmPromise = this._db
      .from('games_gms')
      .delete()
      .eq('game_id', gameId)
      .eq('gm_id', userId);

    const [{ data: deleted, error: gameError }, { error: gameGmDeleteError }] =
      await Promise.all([gamePromise, gameGmPromise]);

    if (gameError || gameGmDeleteError) {
      throw new Error('Failed to delete game');
    }

    return deleted;
  }
}
