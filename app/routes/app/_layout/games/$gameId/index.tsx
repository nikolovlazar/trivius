import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout/games/$gameId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();
  return <div>Hello "/app/_layout/game/{gameId}"!</div>;
}
