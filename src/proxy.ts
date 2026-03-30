import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
  const cookie = req.cookies.get('techcoach_auth')

  if (cookie?.value !== process.env.APP_PASSWORD) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
