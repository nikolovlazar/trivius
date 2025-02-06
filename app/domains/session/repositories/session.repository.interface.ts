import type { Game } from '@/domains/game/types/game';
import type {
  Session,
  SessionInsert,
  SessionUpdate,
} from '@/domains/session/types/session';

export interface ISessionRepository {
  get(id: Session['id']): Promise<Session>;
  getForGame(gameId: Game['id']): Promise<Session[]>;
  update(data: SessionUpdate): Promise<Session>;
  create(data: SessionInsert): Promise<Session>;
  delete(data: Session['id']): Promise<Session>;
}
