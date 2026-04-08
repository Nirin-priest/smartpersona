import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge Middleware (Proxy.js)
 * รับหน้าที่ด่านหน้า (Firewall) ตรวจสอบและสกัดกั้นการเข้าใช้งาน Page/API เส้นทางสำคัญ
 * ป้องกันการเข้าถึงจากผู้ใช้ที่ไม่ล็อกอิน หรือพยายามข้ามสิทธิ์ Admin
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Only apply to /admin, /create, and /api/admin
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/create") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/admin");

  const cookie = request.cookies.get("token")?.value;
  if (!cookie) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let payload;
  try {
    // 2. Verify Token using jose (Edge-compatible) instead of API fetch
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: decodedPayload } = await jwtVerify(cookie, secret);
    payload = decodedPayload;
  } catch (err) {
    console.error("JWT Verify Error in Proxy:", err.message);
    if (isApiRoute) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Admin Route Protection: Must have 'Admin' role
  if (pathname.startsWith("/admin") || isApiRoute) {
    if (payload.role !== "Admin") {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
      }
      // Redirect regular users to their dashboard if they try to access /admin
      const dashboardUrl = new URL("/create/dashboarduser", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 4. Create Route Protection: Admin can't access user side
  if (pathname.startsWith("/create")) {
    if (payload.role === "Admin") {
      // Redirect Admins to the admin area if they try to access /create
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/create/:path*", "/api/admin/:path*"],
};
