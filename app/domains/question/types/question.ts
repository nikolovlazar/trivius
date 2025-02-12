import type { MakeOptional } from '@/domains/shared/utils/make-optional-type';

export type Question = {
  id: number;
  game_id: number;
  content: string;
  right_answer_index: number;
  answer_1_content: string;
  answer_2_content: string;
  answer_3_content: string;
  answer_4_content: string;
};

export type QuestionInsert = MakeOptional<Question, 'id'>;
export type QuestionUpdate = Partial<Omit<Question, 'game_id'>>;
