/*
// This middleware checks if the user is authenticated
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  

  // if pathname is not the authentication route and token does not exist in the cookies
  if (pathname !== '/login' && !request.cookies.get('auth-token')) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
  */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL('/home', request.url))
  console.log(`Incoming request for ${request.nextUrl.pathname}`);
  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}