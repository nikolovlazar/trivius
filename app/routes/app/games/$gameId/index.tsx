import { createFileRoute } from '@tanstack/react-router';

import { getGame } from '@/domains/game/functions/get-game.function';
import { GameDetailsForm } from '@/domains/game/ui/game-details-form';

export const Route = createFileRoute('/app/games/$gameId/')({
  component: RouteComponent,
  loader: async ({ context, params }) =>
    await getGame({
      data: { userId: context.user!.id, gameId: parseInt(params.gameId) },
    }),
});

function RouteComponent() {
  const { game, sessions } = Route.useLoaderData();

  return (
    <div className='flex flex-col'>
      <GameDetailsForm game={game} />
    </div>
  );
}
