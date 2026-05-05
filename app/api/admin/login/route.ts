import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'mt_admin_session'
const MAX_AGE     = 60 * 60 * 8  // 8 hours in seconds

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    const adminPassword    = process.env.ADMIN_PASSWORD
    const sessionToken     = process.env.ADMIN_SESSION_TOKEN

    // Both env vars must be set in production
    if (!adminPassword || !sessionToken) {
      console.error('[Auth] ADMIN_PASSWORD or ADMIN_SESSION_TOKEN env vars missing')
      return NextResponse.json(
        { error: 'Server misconfiguration — contact the site owner.' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      // Artificial delay to slow brute-force attempts
      await new Promise(r => setTimeout(r, 600))
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    // Password correct — set a secure httpOnly cookie
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   MAX_AGE,
    })
    return res

  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
