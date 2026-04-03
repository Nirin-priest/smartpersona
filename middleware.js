import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Only apply to /admin and /create
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/create")) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("token=")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Verify Token and Role via API `/api/auth/verify`
  const verifyUrl = new URL("/api/auth/verify", request.url);
  const verifyRes = await fetch(verifyUrl.toString(), {
    headers: { cookie },
  });

  if (!verifyRes.ok) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userData = await verifyRes.json();

  // 3. Admin Route Protection: Must have 'admin' role
  if (pathname.startsWith("/admin")) {
    if (userData.role !== "admin") {
      // Redirect regular users to their dashboard if they try to access /admin
      const dashboardUrl = new URL("/create/dashboarduser", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 4. Create Route Protection: Just need a valid token (already checked above)
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/create/:path*"],
};
