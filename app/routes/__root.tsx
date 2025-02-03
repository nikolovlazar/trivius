import {
  CatchBoundary,
  Outlet,
  ScriptOnce,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { type ReactNode, lazy } from 'react';

import { fetchUser } from '@/domains/user/functions/fetch-user.function';

import { NotFound } from '@/domains/shared/components/not-found';
import { Toaster } from '@/domains/shared/components/ui/sonner';

import globalCss from '../global.css?url';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Trivius',
      },
    ],
    links: [{ rel: 'stylesheet', href: globalCss }],
  }),
  component: RootComponent,
  beforeLoad: async () => {
    const { user } = await fetchUser();
    return { user };
  },
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <TanStackRouterDevtools />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Meta />
      </head>
      <body>
        <CatchBoundary
          getResetKey={() => 'reset'}
          onCatch={(error) => console.error(error)}
        >
          {children}
        </CatchBoundary>
        <ScrollRestoration />
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
