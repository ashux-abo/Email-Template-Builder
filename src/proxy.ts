import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequestEdge } from "./lib/edge-auth";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/templates",
  "/send-email",
  "/contacts",
  "/history",
  "/settings",
  "/profile",
  "/api/templates",
  "/api/contacts",
  "/api/users",
  "/api/emails",
  "/api/user",
];

export async function proxy(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      // Verify authentication using edge-compatible JWT verification
      const user = await getUserFromRequestEdge(request);

      if (user) {
        return NextResponse.next();
      } else {
        // Invalid token or no token, redirect to login
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Token verification failed, redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
