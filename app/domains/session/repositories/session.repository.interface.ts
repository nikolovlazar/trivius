import type {
  Session,
  SessionInsert,
  SessionUpdate,
} from '@/domains/session/entities/session';

import type { Game } from '@/domains/game/entities/game';

export interface ISessionRepository {
  get(id: Session['id']): Promise<Session>;
  getForGame(gameId: Game['id']): Promise<Session[]>;
  update(data: SessionUpdate): Promise<Session>;
  create(data: SessionInsert): Promise<Session>;
  delete(data: Session['id']): Promise<Session>;
}
