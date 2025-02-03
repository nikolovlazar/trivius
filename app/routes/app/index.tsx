import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { getGames } from '@/domains/game/functions/get-games.function';
import { GamesTable } from '@/domains/game/ui/games-table';
import { NewGameModal } from '@/domains/game/ui/new-game-modal';

import { Button } from '@/domains/shared/components/ui/button';

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
  loader: async ({ context }) => await getGames({ data: context.user!.id }),
});

function RouteComponent() {
  const games = Route.useLoaderData();
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold'>Games</h2>
        <Button onClick={() => setIsNewGameModalOpen(true)}>
          Create New Trivia Game
        </Button>
      </div>

      <GamesTable games={games} />

      {isNewGameModalOpen && (
        <NewGameModal
          isOpen={isNewGameModalOpen}
          onClose={() => setIsNewGameModalOpen(false)}
        />
      )}
    </>
  );
}
