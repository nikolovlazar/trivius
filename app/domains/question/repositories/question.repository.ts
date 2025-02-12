import { SupabaseClient } from '@supabase/supabase-js';

import { Game } from '@/domains/game/types/game';
import type { IQuestionRepository } from '@/domains/question/repositories/question.repository.interface';
import type {
  Question,
  QuestionInsert,
  QuestionUpdate,
} from '@/domains/question/types/question';
import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export class QuestionRepository implements IQuestionRepository {
  private _db: SupabaseClient;

  constructor() {
    this._db = getSupabaseServerClient();
  }

  async getByGameId(gameId: Game['id']): Promise<Question[]> {
    const { data, error } = await this._db
      .from('questions')
      .select('*')
      .eq('game_id', gameId);

    if (!data || error) {
      throw new Error('Failed to get questions by game id', { cause: error });
    }

    return data;
  }

  async get(id: Question['id']): Promise<Question> {
    const { data, error } = await this._db
      .from('questions')
      .select('*')
      .eq('id', id)
      .single<Question>();

    if (!data || error) {
      throw new Error('Question does not exist');
    }

    return data;
  }

  async update(data: QuestionUpdate): Promise<Question> {
    const { data: updated, error } = await this._db
      .from('questions')
      .update(data)
      .eq('id', data.id)
      .select()
      .single<Question>();

    if (!updated || error) {
      throw new Error('Cannot update question', { cause: error });
    }

    return updated;
  }

  async create(data: QuestionInsert): Promise<Question> {
    const { data: created, error } = await this._db
      .from('questions')
      .insert(data)
      .select()
      .single<Question>();

    if (!created || error) {
      throw new Error('Cannot create question', { cause: error });
    }

    return created;
  }

  async delete(id: Question['id']): Promise<Question> {
    const { data: deleted, error } = await this._db
      .from('questions')
      .delete()
      .eq('id', id)
      .single<Question>();

    if (!deleted || error) {
      throw new Error('Failed to delete question', { cause: error });
    }

    return deleted;
  }
}
