import type { Game } from '@/domains/game/types/game';
import type {
  Question,
  QuestionInsert,
  QuestionUpdate,
} from '@/domains/qna/types/question';

export interface IQuestionRepository {
  get(id: Question['id']): Promise<Question>;
  getByGameId(gameId: Game['id']): Promise<Question[]>;
  update(data: QuestionUpdate): Promise<Question>;
  create(data: QuestionInsert): Promise<Question>;
  delete(id: Question['id']): Promise<Question>;
}
