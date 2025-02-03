import { createFileRoute } from '@tanstack/react-router';

import { SessionsTable } from '@/domains/session/ui/sessions-table';

import { getGame } from '@/domains/game/functions/get-game.function';
import { GameDetailsForm } from '@/domains/game/ui/game-details-form';

export const Route = createFileRoute('/app/games/$gameId/')({
  component: RouteComponent,
  loader: async ({ params }) =>
    await getGame({
      data: parseInt(params.gameId),
    }),
  beforeLoad: ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  const { game, sessions } = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  return (
    <div className='flex flex-col gap-4'>
      <GameDetailsForm game={game} />
      <SessionsTable sessions={sessions} game={game} userId={user?.id} />
    </div>
  );
}
