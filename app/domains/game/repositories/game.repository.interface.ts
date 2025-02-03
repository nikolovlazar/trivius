import type { Session } from '@/domains/session/entities/session';

import type {
  Game,
  GameInsert,
  GameUpdate,
} from '@/domains/game/entities/game';

export interface IGameRepository {
  get(id: Game['id']): Promise<Game | null>;
  belongsTo(gameId: Game['id'], userId: string): Promise<boolean>;
  getUsersGamesWithSessions(
    userId: string
  ): Promise<{ game: Game; sessions: Session[] }[]>;
  update(data: GameUpdate): Promise<Game>;
  create(data: { game: GameInsert; userId: string }): Promise<Game>;
  delete(data: { gameId: Game['id']; userId: string }): Promise<Game>;
}
