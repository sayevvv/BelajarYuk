import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Redirect mobile user-agents from the desktop New page to the mobile-optimized route.
export function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;
  if (pathname === '/dashboard/new') {
    const ua = headers.get('user-agent') || '';
    // Basic UA check; avoids client flicker and ensures mobile page is used directly
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    if (isMobile) {
      const url = new URL('/dashboard/new/mobile', req.url);
      url.search = nextUrl.search;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/new'],
};
