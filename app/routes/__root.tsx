import { AUTH_COOKIE_NAME } from '@/config';
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

const loadClientCookies = async (name: string) => {
  const { getClientCookies } = await import(
    '@/domains/shared/utils/client-cookies'
  );
  return getClientCookies(name);
};

const loadServerCookies = async (name: string) => {
  const { getServerCookies } = await import(
    '@/domains/shared/utils/server-cookies'
  );
  return getServerCookies(name);
};

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
    let cookie: string | undefined;

    if (typeof window === 'undefined') {
      cookie = await loadServerCookies(AUTH_COOKIE_NAME);
    } else {
      cookie = await loadClientCookies(AUTH_COOKIE_NAME);
    }

    if (cookie) {
      const { access_token } = JSON.parse(atob(cookie.replace('base64-', '')));
      const { user } = await fetchUser({ data: access_token });
      return { user };
    }

    return { user: undefined };
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
