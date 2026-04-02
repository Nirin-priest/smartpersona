import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // เข้าถึงเฉพาะเส้นทางสร้าง resume
  if (!pathname.startsWith("/create")) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("token=")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ตรวจสอบ Token ผ่าน API `/api/auth/verify`
  const verifyUrl = new URL("/api/auth/verify", request.url);
  const verifyRes = await fetch(verifyUrl.toString(), {
    headers: { cookie },
  });

  if (verifyRes.ok) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/create/:path*"],
};
