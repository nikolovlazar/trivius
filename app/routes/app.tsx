import { useState } from 'react';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

import { Game, GameInsert, Session } from '@/types';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/logout-button';
import { TriviaGameItem } from '@/components/trivia-game-item';
import { getGames } from '@/functions/get-games';
import { SessionManager } from '@/components/session-manager';
import { NewGameModal } from '@/components/new-game-modal';
import { createGame } from '@/functions/create-game';
import { toast } from 'sonner';
import { deleteGame } from '@/functions/delete-game';
import { ConfirmDeletion } from '@/components/confirm-deletion';

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      return redirect({ to: '/signin', statusCode: 307 });
    }
    return { user: context.user };
  },
  loader: async ({ context }) => {
    const games = await getGames({ data: context.user!.id });
    return { games };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { user } = Route.useRouteContext();
  const { games } = Route.useLoaderData();
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{
    game: Game;
    sessions: Session[];
  } | null>(null);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);

  const handleNewGameSubmit = async (game: GameInsert) => {
    try {
      const newGame = await createGame({ data: { ...game, userId: user!.id } });
      if (newGame) {
        setIsNewGameModalOpen(false);
        router.invalidate();
        toast.success('Game created!');
      }
    } catch (error) {
      toast.error('Failed to create game');
    }
  };

  const requestGameDelete = async (game: Game) => {
    setDeletingGame(game);
  };

  const handleGameDelete = async (id: number) => {
    try {
      await deleteGame({ data: id });
      router.invalidate();
      toast.success('Game deleted!');
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const handleManageSessions = (id: string) => {
    const game = games.find((game) => game.game.id === id);
    if (game) {
      setSelectedGame(game);
    }
  };

  return (
    <div>
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-2xl font-bold'>Trivius</h1>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>Your Trivia Games</h2>
          <Button onClick={() => setIsNewGameModalOpen(true)}>
            Create New Trivia Game
          </Button>
        </div>

        <div className='space-y-4'>
          {games.map((game) => (
            <TriviaGameItem
              key={game.game.id}
              id={game.game.id}
              title={game.game.title}
              sessionCount={game.sessions.length ?? 0}
              onDelete={() => requestGameDelete(game.game)}
              onManageSessions={() => handleManageSessions(game.game.id)}
            />
          ))}
        </div>

        {selectedGame && (
          <SessionManager
            gameId={selectedGame.game.id}
            gameName={selectedGame.game.title}
            initialSessions={selectedGame.sessions}
            isOpen={!!selectedGame}
            onClose={() => setSelectedGame(null)}
            onUpdateSessions={(updatedSessions) => {}}
          />
        )}

        {isNewGameModalOpen && (
          <NewGameModal
            isOpen={isNewGameModalOpen}
            onClose={() => setIsNewGameModalOpen(false)}
            onSubmit={handleNewGameSubmit}
          />
        )}

        {deletingGame && (
          <ConfirmDeletion
            isOpen={!!deletingGame}
            onClose={() => setDeletingGame(null)}
            onConfirm={() => handleGameDelete(deletingGame.id)}
            title='Delete Game'
            itemName={deletingGame!.title}
          />
        )}
      </main>
    </div>
  );
}
