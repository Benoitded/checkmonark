import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define allowed origins
const allowedOrigins = ["https://yourdomain.com", "http://localhost:3000"];

export function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;

  // Validate origin
  const origin = headers.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse("Forbidden: Invalid Origin", { status: 403 });
  }

  // Validate user-agent
  const userAgent = headers.get("user-agent");
  if (!userAgent || !userAgent.includes("Mozilla")) {
    return new NextResponse("Forbidden: Invalid User-Agent", { status: 403 });
  }

  return NextResponse.next();
}

// Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
