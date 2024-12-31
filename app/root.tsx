import {
  data,
  type HeadersArgs,
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';
import type { ReactNode } from 'react';
import { BotHandler } from '@/platform/bot';
import stylesheet from '@/tailwind.css?url';
import type { LoaderFunctionArgs } from 'react-router-dom';

const botHandler = new BotHandler({
  waitForContent: true,
  serveSimplifiedContent: true,
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await botHandler.handleRequest(request);
  const headers = new Headers();
  if (result.cacheControl) {
    headers.set('Cache-Control', result.cacheControl);
  }
  return data({ isBot: result.isBot, headers });
}

export function Layout({ children }: { children: ReactNode }) {
  const { isBot } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {!isBot && (
          <>
            <ScrollRestoration />
            <Scripts />
          </>
        )}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
