import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';

import { LogoutButton } from '@/domains/shared/components/logout-button';

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      return redirect({ to: '/signin' });
    }
    return { user: context.user };
  },
});

function RouteComponent() {
  return (
    <div className='flex flex-col min-h-screen bg-muted'>
      <nav className='dark:bg-black bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-2xl font-bold'>
              <Link to='/app'>Trivius</Link>
            </h1>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <div className='flex flex-col px-4'>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-background mt-10 rounded-lg border'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
