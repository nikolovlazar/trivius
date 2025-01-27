import { LogoutButton } from "@/components/logout-button";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Trivius</h1>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-background mt-10 rounded-lg border">
        <Outlet />
      </main>
    </div>
  );
}
