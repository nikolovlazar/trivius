import { SupabaseClient } from '@supabase/supabase-js';

import {
  Session,
  SessionInsert,
  SessionUpdate,
} from '@/domains/session/entities/session';
import { ISessionRepository } from '@/domains/session/repositories/session.repository.interface';

import { Game } from '@/domains/game/entities/game';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export class SessionRepository implements ISessionRepository {
  private _db: SupabaseClient;

  constructor() {
    this._db = getSupabaseServerClient();
  }

  async get(id: Session['id']): Promise<Session> {
    const { data, error } = await this._db
      .from('sessions')
      .select('*')
      .eq('id', id)
      .select()
      .single<Session>();
    if (!data || error) {
      throw new Error('Session not found');
    }
    return data;
  }

  async getForGame(gameId: Game['id']): Promise<Session[]> {
    const { data, error } = await this._db
      .from('sessions')
      .select('*')
      .eq('game_id', gameId);

    if (!data || error) {
      return [];
    }

    return data;
  }

  async update(data: SessionUpdate): Promise<Session> {
    const updatingData: SessionUpdate = { id: data.id, open: data.open };

    if (data.start_time && data.start_time.length > 0) {
      updatingData.start_time = data.start_time;
    }

    if (data.end_time && data.end_time.length > 0) {
      updatingData.end_time = data.end_time;
    }

    if (data.label) {
      updatingData.label = data.label;
    }

    const { data: updated, error } = await this._db
      .from('sessions')
      .update(updatingData)
      .eq('id', data.id)
      .select()
      .single<Session>();

    if (error) {
      throw new Error('Failed to update session');
    }

    return updated;
  }

  async create(data: SessionInsert): Promise<Session> {
    const { data: created, error } = await this._db
      .from('sessions')
      .insert({
        game_id: data.game_id,
        start_time: data.start_time,
        end_time: data.end_time,
        open: data.open,
        label: data.label,
      })
      .select()
      .single<Session>();

    if (error) {
      throw new Error('Failed to create session');
    }

    return created;
  }

  async delete(data: Session['id']): Promise<Session> {
    const { data: deleted, error } = await this._db
      .from('sessions')
      .delete()
      .eq('id', data)
      .select()
      .single<Session>();

    if (error) {
      throw new Error('Failed to delete session');
    }

    return deleted;
  }
}
