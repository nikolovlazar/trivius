import { createFileRoute } from '@tanstack/react-router';

import { getGame } from '@/domains/game/functions/get-game.function';
import { GameDetailsForm } from '@/domains/game/ui/game-details-form';
import { getQuestions } from '@/domains/question/functions/get-questions.function';
import { QuestionsTable } from '@/domains/question/ui/questions-table';
import { SessionsTable } from '@/domains/session/ui/sessions-table';

export const Route = createFileRoute('/app/games/$gameId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { game, sessions } = await getGame({
      data: parseInt(params.gameId),
    });
    const questions = await getQuestions({
      data: { game_id: game.id },
    });
    return { game, sessions, questions };
  },
  beforeLoad: ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  const { game, sessions, questions } = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  return (
    <div className='flex flex-col gap-4'>
      <GameDetailsForm game={game} />
      <SessionsTable sessions={sessions} game={game} userId={user?.id} />
      <QuestionsTable questions={questions} game={game} userId={user?.id} />
    </div>
  );
}
