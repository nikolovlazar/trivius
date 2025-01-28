import type { MakeOptional } from '@/shared/utils/make-optional-type';

export type Game = {
  answer_window: number | null;
  description: string | null;
  id: number;
  title: string;
};

export type GameInsert = MakeOptional<
  Game,
  'answer_window' | 'id' | 'description'
>;

export type GameUpdate = Partial<Game>;
