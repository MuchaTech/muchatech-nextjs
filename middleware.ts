import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mt_admin_session";
const LOGIN_PATH = "/admin/login";
const ADMIN_PATHS = ["/admin/blog"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard actual admin pages (not the login page itself or API routes)
  const isAdminPage = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  if (!isAdminPage) return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;

  // Valid cookie → allow through
  if (session === process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.next();
  }

  // No / invalid cookie → redirect to login, preserve the intended destination
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Only run on admin page routes — skip _next, static, api
  matcher: ["/admin/:path*"],
};
