import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Game, Session } from "@/types";
import { Button } from "@/components/ui/button";
import { TriviaGameItem } from "./-components/trivia-game-item";
import { SessionManager } from "./-components/session-manager";
import { NewGameModal } from "./-components/new-game-modal";
import { createServerFn } from "@tanstack/start";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const Route = createFileRoute("/app/_layout/")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      return redirect({ to: "/signin", statusCode: 307 });
    }
    return { user: context.user };
  },
  loader: async ({ context }) => {
    const games = await getGames({ data: context.user!.id });
    return { games };
  },
});

function RouteComponent() {
  const { games } = Route.useLoaderData();
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Trivia Games</h2>
        <Button onClick={() => setIsNewGameModalOpen(true)}>
          Create New Trivia Game
        </Button>
      </div>

      <div className="space-y-4">
        {games.map(({ game, sessions }) => (
          <TriviaGameItem
            key={game.id}
            id={game.id}
            title={game.title}
            sessionCount={sessions.length}
            onManageSessions={() => handleManageSessions(game.id)}
          />
        ))}
      </div>

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

const getGames = createServerFn()
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const supabase = getSupabaseServerClient();

    const { data: gamesGms, error: gamesGmsError } = await supabase
      .from("games_gms")
      .select("*")
      .eq("gm_id", userId);

    if (gamesGmsError) {
      throw new Error("Failed to fetch games");
    }

    const games = await Promise.all(
      gamesGms.map(async (gameGm) => {
        const gamePromise = supabase
          .from("games")
          .select("*")
          .eq("id", gameGm.game_id)
          .single();

        const sessionsPromise = supabase
          .from("sessions")
          .select("*")
          .eq("game_id", gameGm.game_id);

        const [{ data: game }, { data: sessions }] = await Promise.all([
          gamePromise,
          sessionsPromise,
        ]);

        return { game: game as Game, sessions: (sessions as Session[]) ?? [] };
      }),
    );

    return games;
  });
