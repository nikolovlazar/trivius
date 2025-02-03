import { SessionRepository } from '@/domains/session/repositories/session.repository';
import type { ISessionRepository } from '@/domains/session/repositories/session.repository.interface';

import { GameRepository } from '@/domains/game/repositories/game.repository';
import type { IGameRepository } from '@/domains/game/repositories/game.repository.interface';

let gameRepository: IGameRepository;
let sessionRepository: ISessionRepository;

if (process.env.NODE_ENV === 'testing') {
  // Instantiate the Mock repositories
  gameRepository = new GameRepository();
  sessionRepository = new SessionRepository();
} else {
  gameRepository = new GameRepository();
  sessionRepository = new SessionRepository();
}

export { gameRepository, sessionRepository };
