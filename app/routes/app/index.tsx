import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/domains/shared/components/ui/button';

import { NewGameModal } from '@/domains/game/ui/new-game-modal';
import { getGames } from '@/domains/game/functions/get-games.function';
import { Game } from '@/domains/game/entities/game';

import { SessionManager } from '@/domains/session/ui/session-manager';
import { Session } from '@/domains/session/entities/session';
import { GamesTable } from '@/domains/game/ui/games-table';

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
  loader: async ({ context }) => await getGames({ data: context.user!.id }),
});

function RouteComponent() {
  const games = Route.useLoaderData();
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{
    game: Game;
    sessions: Session[];
  } | null>(null);

  const handleManageSessions = (id: number) => {
    const game = games.find((game) => game.game.id === id);
    if (game) {
      setSelectedGame(game);
    }
  };

  const handleNewSession = async (session: Session) => {
    handleManageSessions(session.game_id);
  };

  const handleStopSession = (session: Session) => {
    handleManageSessions(session.game_id);
  };

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold'>Games</h2>
        <Button onClick={() => setIsNewGameModalOpen(true)}>
          Create New Trivia Game
        </Button>
      </div>

      <GamesTable games={games} onManageSessions={handleManageSessions} />

      {selectedGame && (
        <SessionManager
          gameId={selectedGame.game.id}
          gameName={selectedGame.game.title}
          sessions={selectedGame.sessions}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          onNewSession={handleNewSession}
          onStopSession={handleStopSession}
        />
      )}

      {isNewGameModalOpen && (
        <NewGameModal
          isOpen={isNewGameModalOpen}
          onClose={() => setIsNewGameModalOpen(false)}
        />
      )}
    </>
  );
}
