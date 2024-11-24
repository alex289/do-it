import { NextResponse } from 'next/server';

import type { Session } from 'better-auth/types';
import type { NextRequest } from 'next/server';

export default async function authMiddleware(request: NextRequest) {
  const response = await fetch(
    process.env.BETTER_AUTH_URL + '/api/auth/get-session',
    {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    },
  );

  const session = (await response.json()) as Session;

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sign-in|auth).*)',
  ],
};
