import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      return redirect({ to: "/signin", statusCode: 307 });
    }

    return { user: context.user };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return <div>Hello, {user}</div>;
}
