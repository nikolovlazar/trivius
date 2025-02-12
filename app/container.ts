import { GameRepository } from '@/domains/game/repositories/game.repository';
import type { IGameRepository } from '@/domains/game/repositories/game.repository.interface';
import { QuestionRepository } from '@/domains/question/repositories/question.repository';
import type { IQuestionRepository } from '@/domains/question/repositories/question.repository.interface';
import { SessionRepository } from '@/domains/session/repositories/session.repository';
import type { ISessionRepository } from '@/domains/session/repositories/session.repository.interface';

let gameRepository: IGameRepository;
let sessionRepository: ISessionRepository;
let questionRepository: IQuestionRepository;

if (process.env.NODE_ENV === 'testing') {
  gameRepository = new GameRepository();
  sessionRepository = new SessionRepository();
  questionRepository = new QuestionRepository();
} else {
  gameRepository = new GameRepository();
  sessionRepository = new SessionRepository();
  questionRepository = new QuestionRepository();
}

export { gameRepository, sessionRepository, questionRepository };
