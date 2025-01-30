import { MakeOptional } from '@/domains/shared/utils/make-optional-type';

export type Session = {
  current_question: number | null;
  end_time: string | null;
  game_id: number;
  id: number;
  open: boolean;
  start_time: string;
  label: string;
};

export type SessionInsert = MakeOptional<
  Session,
  'current_question' | 'end_time' | 'id' | 'open' | 'label'
>;

export type SessionUpdate = Partial<Session>;
