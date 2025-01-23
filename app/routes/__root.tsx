// app/routes/__root.tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  ScriptOnce,
  CatchBoundary,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";

import globalCss from "../global.css?url";
import { fetchUser } from "@/functions/fetch-user";

const loadClientCookies = async (name: string) => {
  const { getClientCookies } = await import("@/utils/client-cookies");
  return getClientCookies(name);
};

const loadServerCookies = async (name: string) => {
  const { getServerCookies } = await import("@/utils/server-cookies");
  return getServerCookies(name);
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Trivius",
      },
    ],
    links: [{ rel: "stylesheet", href: globalCss }],
  }),
  component: RootComponent,
  beforeLoad: async () => {
    let cookie: string | undefined;

    if (typeof window === "undefined") {
      cookie = await loadServerCookies("trivius-auth");
    } else {
      cookie = await loadClientCookies("trivius-auth");
    }

    if (cookie) {
      const { access_token } = JSON.parse(atob(cookie.replace("base64-", "")));
      const { user } = await fetchUser({ data: access_token });
      return { user };
    }

    return { authCookie: undefined };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
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
          getResetKey={() => "reset"}
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
        <Scripts />
      </body>
    </html>
  );
}
