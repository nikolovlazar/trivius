import { MakeOptional } from '@/domains/shared/utils/make-optional-type';

export type Session = {
  current_question: number | null;
  end_time: string | null;
  game_id: number;
  id: number;
  open: boolean;
  start_time: string | null;
  label: string;
};

export type SessionInsert = MakeOptional<
  Session,
  'current_question' | 'id' | 'open' | 'label'
>;

export type SessionUpdate = MakeOptional<
  Session,
  'current_question' | 'end_time' | 'game_id' | 'open' | 'start_time' | 'label'
>;
