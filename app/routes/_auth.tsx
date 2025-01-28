import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted'>
      <div className='w-full max-w-sm'>
        <Outlet />
      </div>
    </div>
  );
}
