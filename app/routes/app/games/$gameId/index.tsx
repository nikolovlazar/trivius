import { createFileRoute } from '@tanstack/react-router';

import { getGame } from '@/domains/game/functions/get-game.function';

export const Route = createFileRoute('/app/games/$gameId/')({
  component: RouteComponent,
  loader: async ({ context, params }) =>
    await getGame({
      data: { userId: context.user!.id, gameId: parseInt(params.gameId) },
    }),
});

function RouteComponent() {
  const { game } = Route.useLoaderData();
  return <div>{game.title}</div>;
}
