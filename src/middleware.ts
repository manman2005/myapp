import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const path = req.nextUrl.pathname

    const isAuthPage = path === '/sign-in' || path === '/sign-up'

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // กรณีทุกอย่างถูกต้อง ปล่อยผ่าน
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customers/:path*',
    '/work-orders/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/sign-in',
    '/sign-up',
  ],
}
